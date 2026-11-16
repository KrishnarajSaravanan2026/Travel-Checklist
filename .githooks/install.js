'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const HOOKS_PATH = '.githooks';
const HOOKS = ['pre-commit', 'commit-msg', 'pre-push'];

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

function runGit(args, allowFailure) {
  try {
    return execFileSync(GIT, args, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    }).trim();
  } catch (error) {
    if (allowFailure) return '';
    const details = error.stderr ? String(error.stderr).trim() : error.message;
    throw new Error('Git command failed: ' + details);
  }
}

function checkInstallation() {
  const configuredPath = runGit(['config', '--local', '--get', 'core.hooksPath'], true);
  const hooksExist = HOOKS.every(function (hook) {
    return fs.existsSync(path.join(__dirname, hook));
  });

  if (configuredPath === HOOKS_PATH && hooksExist) {
    console.log('Git commit guard is active for this repository.');
    return true;
  }

  console.error('Git commit guard is NOT active for this repository.');
  if (configuredPath !== HOOKS_PATH) {
    console.error('Expected core.hooksPath to be ' + HOOKS_PATH + '.');
  }
  if (!hooksExist) {
    console.error('One or more required hook scripts are missing.');
  }
  return false;
}

function install() {
  const gitRoot = runGit(['rev-parse', '--show-toplevel']);
  if (path.resolve(gitRoot) !== ROOT) {
    throw new Error('Run this installer from the repository that contains .githooks.');
  }

  HOOKS.forEach(function (hook) {
    if (!fs.existsSync(path.join(__dirname, hook))) {
      throw new Error('Required Git hook is missing: ' + hook);
    }
  });

  runGit(['config', '--local', 'core.hooksPath', HOOKS_PATH]);
  return checkInstallation();
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--check') {
    process.exitCode = checkInstallation() ? 0 : 1;
    return;
  }
  if (args.length !== 0) {
    console.error('Usage: node .githooks/install.js [--check]');
    process.exitCode = 2;
    return;
  }

  process.exitCode = install() ? 0 : 1;
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { checkInstallation, install };
