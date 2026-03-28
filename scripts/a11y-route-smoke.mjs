#!/usr/bin/env node

import { spawn } from 'node:child_process';
import process from 'node:process';

const PORT = 4111;
const HOST = '127.0.0.1';
const BASE_URL = `http://${HOST}:${PORT}`;

const ROUTES = [
  '/',
  '/ev',
  '/parlay',
  '/odds-converter',
  '/guides',
  '/es',
  '/es/ev',
  '/es/parlay',
  '/es/odds-converter',
  '/es/guides',
];

const REQUIRED_MARKERS = [
  {
    id: 'skip-link',
    test: (html) => html.includes('Skip to main content') && html.includes('href="#main-content"'),
    reason: 'Missing skip-to-main-content link in rendered HTML.',
  },
  {
    id: 'main-anchor',
    test: (html) => html.includes('id="main-content"'),
    reason: 'Missing #main-content anchor target for keyboard skip link.',
  },
  {
    id: 'h1',
    test: (html) => /<h1\b[^>]*>/i.test(html),
    reason: 'Missing <h1> heading in route output.',
  },
];

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitForServer(timeoutMs = 60000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(`${BASE_URL}/`);
      if (response.ok) {
        return;
      }
    } catch {
      // Server not ready yet.
    }

    await sleep(1000);
  }

  throw new Error(`Timed out waiting for Next.js server at ${BASE_URL}.`);
}

async function runChecks() {
  const failures = [];

  for (const route of ROUTES) {
    const response = await fetch(`${BASE_URL}${route}`);

    if (!response.ok) {
      failures.push(`${route}: returned HTTP ${response.status}.`);
      continue;
    }

    const html = await response.text();

    for (const marker of REQUIRED_MARKERS) {
      if (!marker.test(html)) {
        failures.push(`${route}: ${marker.reason}`);
      }
    }

    const inputTags = html.match(/<input\b/gi) ?? [];
    const ariaInputTags = html.match(/<input\b[^>]*aria-label=/gi) ?? [];

    if (inputTags.length > 0 && ariaInputTags.length === 0) {
      failures.push(`${route}: input fields detected but none include aria-label in rendered HTML.`);
    }
  }

  return failures;
}

async function main() {
  const nextStart = spawn(
    process.execPath,
    ['./node_modules/next/dist/bin/next', 'start', '-p', String(PORT), '-H', HOST],
    {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env,
    },
  );

  let serverOutput = '';

  nextStart.stdout.on('data', (chunk) => {
    const text = chunk.toString();
    serverOutput += text;
    process.stdout.write(text);
  });

  nextStart.stderr.on('data', (chunk) => {
    const text = chunk.toString();
    serverOutput += text;
    process.stderr.write(text);
  });

  try {
    await waitForServer();
    const failures = await runChecks();

    if (failures.length > 0) {
      console.error('\nAccessibility smoke checks failed:');
      for (const failure of failures) {
        console.error(`- ${failure}`);
      }
      process.exitCode = 1;
      return;
    }

    console.log('\nAccessibility smoke checks passed.');
  } catch (error) {
    console.error('\nFailed to run accessibility smoke checks.');
    console.error(error instanceof Error ? error.message : String(error));
    if (serverOutput.trim().length > 0) {
      console.error('\nServer output:\n' + serverOutput);
    }
    process.exitCode = 1;
  } finally {
    nextStart.kill('SIGTERM');
    await sleep(500);
    if (!nextStart.killed) {
      nextStart.kill('SIGKILL');
    }
  }
}

await main();
