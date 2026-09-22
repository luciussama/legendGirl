import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(projectRoot, 'assets', 'manifest.json');

const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const entries = [
  ...Object.entries(manifest.images || {}),
  ...Object.entries(manifest.spritesheets || {})
];
const missing = [];

for (const [key, source] of entries) {
  if (typeof source !== 'string' || !source.trim()) {
    missing.push(`${key}: invalid path`);
    continue;
  }

  const relativePath = source.replace(/^\/+/, '');
  try {
    await fs.access(path.join(projectRoot, relativePath));
  } catch {
    missing.push(`${key}: ${source}`);
  }
}

if (missing.length > 0) {
  console.error('Asset check failed:');
  for (const entry of missing) console.error(`- ${entry}`);
  process.exitCode = 1;
} else {
  console.log(`Asset check passed: ${entries.length} registered assets.`);
}