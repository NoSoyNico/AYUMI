#!/usr/bin/env node
/**
 * AYUMI Build & Packaging Script
 * Compiles and packages the plugin into an official `.mmpkg` distributable archive
 * using the MemoMind Open Platform toolchain.
 * Creado por Nicolás Carvajal (@El.Bioniico / @nosoynico).
 */

import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { copyFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginDir = resolve(__dirname, 'plugin');
const distDir = resolve(__dirname, 'dist');
const outputFile = resolve(distDir, 'com.ayumi.app-1.0.0.mmpkg');
const legacyOutputFile = resolve(distDir, 'com.nico.ai-1.0.0.mmpkg');
const packagerScript = resolve(
  __dirname,
  '../mamomind/PhoneSDK/tools/build-mmpkg.mjs'
);

console.log('--- AYUMI Build System ---');
console.log(`Source Plugin:  ${pluginDir}`);
console.log(`Output Package: ${outputFile}`);
console.log(`Packager:       ${packagerScript}`);

const result = spawnSync(
  process.execPath,
  [packagerScript, pluginDir, outputFile],
  { stdio: 'inherit' }
);

if (result.status !== 0) {
  console.error('\n❌ Build failed!');
  process.exit(result.status || 1);
}

// Copy to legacy filename for seamless studio compatibility
try {
  copyFileSync(outputFile, legacyOutputFile);
} catch (e) {}

console.log('\n✅ Build successful! Distributable ready:');
console.log(`📦 ${outputFile}`);
console.log(`📦 ${legacyOutputFile}`);
