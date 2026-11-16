'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { inspectContent, inspectPath, isPlaceholder } = require('../.githooks/guard.js');

const config = { allow: [], internalDomains: [] };

test('blocks a token-shaped value without including the value in findings', function () {
  const token = 'ghp_' + 'a'.repeat(36);
  const findings = inspectContent('src/config.js', 'const token = "' + token + '";', config);
  assert.equal(findings.some(function (finding) {
    return finding.rule === 'github-token' && finding.severity === 'block';
  }), true);
  assert.equal(JSON.stringify(findings).includes(token), false);
});

test('does not block obvious placeholder credentials', function () {
  const findings = inspectContent('README.md', 'api_key = "your-api-key-here"', config);
  assert.equal(findings.some(function (finding) {
    return finding.severity === 'block';
  }), false);
  assert.equal(isPlaceholder('replace-me'), true);
});

test('blocks credential files and permits an example env template', function () {
  assert.equal(inspectPath('.env.production', config).some(function (finding) {
    return finding.severity === 'block';
  }), true);
  assert.equal(inspectPath('.env.example', config).some(function (finding) {
    return finding.severity === 'block';
  }), false);
  assert.equal(inspectPath('keys/id_ed25519', config).some(function (finding) {
    return finding.severity === 'block';
  }), true);
  assert.equal(inspectPath('keys/id_ed25519.pub', config).some(function (finding) {
    return finding.severity === 'block';
  }), false);
});

test('reports email-like text as a manual-review warning', function () {
  const address = 'sample' + '@' + 'example.com';
  const findings = inspectContent('test-data/sample.txt', address, config);
  assert.equal(findings.some(function (finding) {
    return finding.rule === 'email-address' && finding.severity === 'warn';
  }), true);
});
