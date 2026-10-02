#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const IGNORED_DIRS = new Set(['.git', 'node_modules', 'dist']);
const ALLOWED_DOC_FILES = new Set(['OWNER-GITHUB-PURGE.md']);
const BANNED_NAME_PATTERNS = [
  { name: 'Forbidden personal name (EN)', regex: /\bmeisam\b/i },
  { name: 'Forbidden personal name (FA)', regex: /میثم/ },
  { name: 'Forbidden project name (EN)', regex: /\bgolha\b/i },
  { name: 'Forbidden project name (FA)', regex: /گلها/ },
  { name: 'Old sensitive extract prefix', regex: /extracted_data_/i },
  { name: 'Private key header', regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/ }
];

let violationCount = 0;

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(process.cwd(), fullPath);

    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      // Check directory name
      for (const pattern of BANNED_NAME_PATTERNS) {
        if (pattern.regex.test(entry.name)) {
          console.error(`❌ [VIOLATION] Directory name matches ${pattern.name}: ${relPath}`);
          violationCount++;
        }
      }
      scanDir(fullPath);
    } else if (entry.isFile()) {
      // Check file name
      if (entry.name === '.env') {
        console.error(`❌ [VIOLATION] Unignored active .env file found: ${relPath}`);
        violationCount++;
      }

      // Check file name against banned patterns
      for (const pattern of BANNED_NAME_PATTERNS) {
        if (pattern.regex.test(entry.name)) {
          console.error(`❌ [VIOLATION] File name matches ${pattern.name}: ${relPath}`);
          violationCount++;
        }
      }

      // Skip this script itself and explicit purge documentation guides from content scanning
      if (relPath.endsWith('privacy-scan.mjs') || ALLOWED_DOC_FILES.has(entry.name)) {
        continue;
      }

      // Scan file content (text files only)
      try {
        const ext = path.extname(entry.name).toLowerCase();
        const textExts = ['.ts', '.js', '.mjs', '.cjs', '.json', '.md', '.yml', '.yaml', '.txt', '.html', '.css', '.sh'];
        if (textExts.includes(ext) || entry.name.startsWith('.')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          for (const pattern of BANNED_NAME_PATTERNS) {
            if (pattern.regex.test(content)) {
              console.error(`❌ [VIOLATION] File content in ${relPath} matches ${pattern.name}`);
              violationCount++;
            }
          }
        }
      } catch (err) {
        // Binary or unreadable file
      }
    }
  }
}

console.log('🔒 Starting IEAB Privacy & Sensitive Patterns Scan...');
scanDir(process.cwd());

if (violationCount === 0) {
  console.log('✅ [PASSED] Repository is completely clean of forbidden names and sensitive patterns.');
  process.exit(0);
} else {
  console.error(`❌ [FAILED] Found ${violationCount} privacy violation(s).`);
  process.exit(1);
}
