'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(__dirname, 'guard.config.json');
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const BLOCKED_PATHS = [
  /(^|\/)\.env(?:$|\.(?!example$))/i,
  /(^|\/)(?:secrets\.json|local\.settings\.json|appsettings\.Development\.json)$/i,
  /(^|\/)(?:\.npmrc|\.pypirc|\.netrc|\.git-credentials)$/i,
  /(^|\/)(?:id_rsa|id_ed25519)$/i,
  /\.(?:pem|key|pfx|p12|jks)$/i,
  /\.(?:sql|bak|dump|mdb|sqlite)$/i,
  /(^|\/)(?:node_modules|_site|coverage)(\/|$)/i,
  /\.(?:log)$/i,
  /(^|\/)(?:\.DS_Store|Thumbs\.db)$/i
];

const SECRET_PATTERNS = [
  { rule: 'private-key', regex: /-----BEGIN(?: [A-Z0-9]+)* PRIVATE KEY-----/g },
  { rule: 'github-token', regex: /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{22,})\b/g },
  { rule: 'aws-access-key', regex: /\bAKIA[0-9A-Z]{16}\b/g },
  { rule: 'email-address', severity: 'warn', regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi }
];

const SECRET_ASSIGNMENT = /\b(?:api[_-]?key|access[_-]?token|refresh[_-]?token|client[_-]?secret|password)\b\s*[:=]\s*(?:"([^"\r\n]*)"|'([^'\r\n]*)'|([^\s,;#]+))/gi;

function findGitExecutable() {
  const commandName = process.platform === 'win32' ? 'git.exe' : 'git';
  const pathEntries = (process.env.PATH || '').split(path.delimiter).filter(Boolean);

  if (process.platform === 'win32' && process.env.ProgramFiles) {
    pathEntries.unshift(path.join(process.env.ProgramFiles, 'Git', 'cmd'));
  }

  for (const entry of pathEntries) {
    const candidate = path.join(entry, commandName);
    if (fs.existsSync(candidate)) return candidate;
  }

  return commandName;
}

const GIT = findGitExecutable();

function runGit(args, options) {
  const settings = options || {};
  return execFileSync(GIT, args, {
    cwd: ROOT,
    encoding: settings.encoding === undefined ? 'utf8' : settings.encoding,
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe']
  });
}

function getConfig() {
  let config;
  try {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (error) {
    throw new Error('Unable to read .githooks/guard.config.json: ' + error.message);
  }

  if (!config || !Array.isArray(config.allow) || !Array.isArray(config.internalDomains)) {
    throw new Error('Guard config must define allow and internalDomains arrays.');
  }

  config.allow.forEach(function (entry) {
    if (!entry || !entry.path || !entry.rule || !entry.reason) {
      throw new Error('Every guard allow-list entry needs a path, rule, and reason.');
    }
  });

  return config;
}

function isPlaceholder(value) {
  const normalized = String(value).trim().replace(/^['"`]|['"`]$/g, '').trim().toLowerCase();
  return /^(?:your[-_ ]|example[-_ ]|sample[-_ ]|dummy[-_ ]|replace[-_ ]?me|changeme|redacted|xxx+|test[-_ ]|<[^>]+>|\$\{[^}]+\})/.test(normalized);
}

function isGuardAllowed(file, rule, line) {
  if (/guard:allow\s+\S+/i.test(line)) return true;
  return false;
}

function isConfigAllowed(config, file, rule) {
  return config.allow.some(function (entry) {
    return entry.path === file && entry.rule === rule;
  });
}

function inspectPath(file, config) {
  const normalized = file.replace(/\\/g, '/');
  const findings = [];

  BLOCKED_PATHS.forEach(function (pattern) {
    if (pattern.test(normalized)) {
      findings.push({ rule: 'blocked-file', severity: 'block', line: 0 });
    }
  });

  const basename = path.posix.basename(normalized);
  if (/^\.env/i.test(basename) && basename.toLowerCase() !== '.env.example') {
    findings.push({ rule: 'environment-file', severity: 'block', line: 0 });
  }

  if (/\.(?:csv|pdf|docx?|xlsx?|png|jpe?g|gif|webp)$/i.test(normalized)) {
    findings.push({ rule: 'manual-data-review', severity: 'warn', line: 0 });
  }

  config.internalDomains.forEach(function (domain) {
    if (domain && normalized.toLowerCase().includes(String(domain).toLowerCase())) {
      findings.push({ rule: 'internal-domain', severity: 'warn', line: 0 });
    }
  });

  return findings;
}

function inspectContent(file, content, config) {
  const findings = [];
  const text = Buffer.isBuffer(content) ? content.toString('utf8') : String(content);
  if (text.includes('\0')) return findings;

  const lines = text.split(/\r?\n/);
  lines.forEach(function (line, index) {
    const lineNumber = index + 1;
    config.internalDomains.forEach(function (domain) {
      if (domain && line.toLowerCase().includes(String(domain).toLowerCase())) {
        findings.push({ rule: 'internal-domain', severity: 'warn', line: lineNumber });
      }
    });

    SECRET_PATTERNS.forEach(function (entry) {
      entry.regex.lastIndex = 0;
      if (entry.regex.test(line)) {
        findings.push({
          rule: entry.rule,
          severity: entry.severity || 'block',
          line: lineNumber
        });
      }
    });

    SECRET_ASSIGNMENT.lastIndex = 0;
    let match;
    while ((match = SECRET_ASSIGNMENT.exec(line)) !== null) {
      const value = match[1] || match[2] || match[3] || '';
      if (value && !isPlaceholder(value)) {
        findings.push({ rule: 'credential-assignment', severity: 'block', line: lineNumber });
        break;
      }
    }
  });

  return findings;
}

function parseNulList(buffer) {
  return buffer.toString('utf8').split('\0').filter(Boolean);
}

function getStagedFiles() {
  return parseNulList(runGit([
    'diff',
    '--cached',
    '--name-only',
    '--diff-filter=ACMRT',
    '-z'
  ]));
}

function getWorkingFiles() {
  return parseNulList(runGit([
    'ls-files',
    '-z',
    '--cached',
    '--others',
    '--exclude-standard'
  ]));
}

function getBlobFromIndex(file) {
  return runGit(['show', ':' + file], { encoding: null });
}

function getBlobAtCommit(commit, file) {
  return runGit(['cat-file', 'blob', commit + ':' + file], { encoding: null });
}

function getCommitFiles(commit) {
  return parseNulList(runGit([
    'diff-tree',
    '--root',
    '-r',
    '--no-commit-id',
    '--name-only',
    '--diff-filter=ACMRT',
    '-z',
    commit
  ]));
}

function getUnpushedCommits() {
  let base = '';
  try {
    base = runGit(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}']).toString().trim();
  } catch (error) {
    const branch = runGit(['rev-parse', '--abbrev-ref', 'HEAD']).toString().trim();
    const branchRemote = 'origin/' + branch;
    try {
      runGit(['rev-parse', '--verify', branchRemote]);
      base = branchRemote;
    } catch (remoteBranchError) {
      try {
        runGit(['rev-parse', '--verify', 'origin/main']);
        base = 'origin/main';
      } catch (mainError) {
        throw new Error('No upstream or origin/main is available. Fetch the remote branch before scanning unpushed commits.');
      }
    }
  }

  return runGit(['rev-list', '--reverse', base + '..HEAD'])
    .toString()
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
}

function readWorkingFile(file) {
  const fullPath = path.join(ROOT, ...file.split('/'));
  if (!fs.existsSync(fullPath)) return null;
  const stat = fs.lstatSync(fullPath);
  if (stat.isSymbolicLink()) {
    return { content: Buffer.from(''), size: 0, symlink: true };
  }
  return {
    content: fs.readFileSync(fullPath),
    size: stat.size,
    symlink: false
  };
}

function scanFiles(entries, config) {
  const unique = new Map();
  entries.forEach(function (entry) {
    const key = entry.file + '\0' + entry.version;
    if (!unique.has(key)) unique.set(key, entry);
  });

  const findings = [];
  unique.forEach(function (entry) {
    inspectPath(entry.file, config).forEach(function (finding) {
      findings.push(Object.assign({ file: entry.file }, finding));
    });

    if (entry.symlink) {
      findings.push({ file: entry.file, rule: 'symbolic-link', severity: 'warn', line: 0 });
    }
    if (entry.size > MAX_FILE_BYTES) {
      findings.push({ file: entry.file, rule: 'large-file', severity: 'warn', line: 0 });
    }

    inspectContent(entry.file, entry.content, config).forEach(function (finding) {
      const line = entry.content.toString('utf8').split(/\r?\n/)[finding.line - 1] || '';
      if (isGuardAllowed(entry.file, finding.rule, line) || isConfigAllowed(config, entry.file, finding.rule)) {
        return;
      }
      findings.push(Object.assign({ file: entry.file }, finding));
    });
  });

  return findings;
}

function formatFinding(finding) {
  const location = finding.line ? finding.file + ':' + finding.line : finding.file;
  return finding.severity.toUpperCase() + ' ' + finding.rule + ': ' + location;
}

function report(findings, label) {
  const unique = new Map();
  findings.forEach(function (finding) {
    const key = [finding.severity, finding.rule, finding.file, finding.line].join('\0');
    if (!unique.has(key)) unique.set(key, finding);
  });

  const results = Array.from(unique.values());
  if (results.length) {
    results.forEach(function (finding) {
      const output = finding.severity === 'block' ? console.error : console.warn;
      output(formatFinding(finding));
    });
  }

  const blocks = results.filter(function (finding) {
    return finding.severity === 'block';
  }).length;
  const warnings = results.filter(function (finding) {
    return finding.severity === 'warn';
  }).length;

  if (blocks) {
    console.error(label + ': blocked by ' + blocks + ' finding(s); values are not printed.');
    return false;
  }

  console.log(label + ': no blocking findings' + (warnings ? '; ' + warnings + ' warning(s) require manual review.' : '.'));
  return true;
}

function scanStaged(config) {
  const files = getStagedFiles();
  const entries = files.map(function (file) {
    const content = getBlobFromIndex(file);
    return { file: file, content: content, size: content.length, version: 'index' };
  });
  return report(scanFiles(entries, config), 'Staged scan');
}

function scanWorkingTreeAndHistory(config) {
  const entries = [];

  getWorkingFiles().forEach(function (file) {
    try {
      const result = readWorkingFile(file);
      if (!result) return;
      entries.push({
        file: file,
        content: result.content,
        size: result.size,
        symlink: result.symlink,
        version: 'working-tree'
      });
    } catch (error) {
      throw new Error('Unable to read tracked project file ' + file + ': ' + error.message);
    }
  });

  const commits = runGit(['rev-list', 'HEAD']).toString().trim().split(/\r?\n/).filter(Boolean);
  commits.forEach(function (commit) {
    getCommitFiles(commit).forEach(function (file) {
      const content = getBlobAtCommit(commit, file);
      entries.push({
        file: file,
        content: content,
        size: content.length,
        version: commit
      });
    });
  });

  return report(scanFiles(entries, config), 'Full scan');
}

function scanUnpushed(config) {
  const commits = getUnpushedCommits();
  const entries = [];
  commits.forEach(function (commit) {
    getCommitFiles(commit).forEach(function (file) {
      const content = getBlobAtCommit(commit, file);
      entries.push({
        file: file,
        content: content,
        size: content.length,
        version: commit
      });
    });
  });
  return report(scanFiles(entries, config), 'Unpushed-history scan');
}

function main(args) {
  const config = getConfig();
  let passed;
  if (args.length === 1 && args[0] === '--staged') {
    passed = scanStaged(config);
  } else if (args.length === 1 && args[0] === '--unpushed') {
    passed = scanUnpushed(config);
  } else if (args.length === 1 && args[0] === '--all') {
    passed = scanWorkingTreeAndHistory(config);
  } else {
    console.error('Usage: node .githooks/guard.js --staged|--unpushed|--all');
    process.exitCode = 2;
    return;
  }

  if (!passed) process.exitCode = 1;
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error('Commit guard failed: ' + error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  inspectContent,
  inspectPath,
  isPlaceholder
};
