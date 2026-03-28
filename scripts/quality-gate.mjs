#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

const checks = [
  {
    name: 'Global collaboration governance enabled',
    run: () => read('AGENTS.md').includes('## Agent Collaboration Governance'),
    fix: 'Add the Agent Collaboration Governance section to AGENTS.md.',
  },
  {
    name: 'Global governance sets application success priority',
    run: () => read('AGENTS.md').includes('Application success is the top priority'),
    fix: 'Add explicit application-success-first rule to AGENTS.md collaboration governance.',
  },
  {
    name: 'Root layout has skip link',
    run: () => {
      const layout = read('app/layout.tsx');
      return layout.includes('href="#main-content"') && layout.includes('Skip to main content');
    },
    fix: 'Add a keyboard-visible skip link in app/layout.tsx pointing to #main-content.',
  },
  {
    name: 'Root layout has main content anchor target',
    run: () => read('app/layout.tsx').includes('id="main-content"'),
    fix: 'Add id="main-content" on the primary content container in app/layout.tsx.',
  },
  {
    name: 'Localized guides hero supports EN and ES',
    run: () => {
      const localizedGuides = read('app/[lang]/guides/page.tsx');
      return localizedGuides.includes("lang === 'es' ? 'Guías de Apuestas' : 'Sports Betting Guides'");
    },
    fix: 'Use locale-conditional hero copy in app/[lang]/guides/page.tsx for EN/ES parity.',
  },
  {
    name: 'Custom agents avoid unsupported model key',
    run: () => {
      const business = read('.github/agents/business.agent.md');
      const uiUx = read('.github/agents/ui-ux.agent.md');
      const seo = read('.github/agents/seo-check.agent.md');
      return !business.includes('\nmodel:') && !uiUx.includes('\nmodel:') && !seo.includes('\nmodel:');
    },
    fix: 'Remove unsupported model: field from custom agent frontmatter files.',
  },
  {
    name: 'Business agent defines conflict-handling protocol',
    run: () => read('.github/agents/business.agent.md').includes('Conflict-handling protocol (mandatory)'),
    fix: 'Add mandatory conflict-handling protocol section in .github/agents/business.agent.md.',
  },
  {
    name: 'UI/UX agent consults business first',
    run: () => read('.github/agents/ui-ux.agent.md').includes('Consult `business` first'),
    fix: 'Update .github/agents/ui-ux.agent.md to consult business first for prioritization/tradeoffs.',
  },
  {
    name: 'SEO agent consults business first for tradeoffs',
    run: () => read('.github/agents/seo-check.agent.md').includes('Consult `business` first'),
    fix: 'Update .github/agents/seo-check.agent.md to consult business first for product tradeoffs.',
  },
  {
    name: 'All custom agents enforce truth-first behavior',
    run: () => {
      const business = read('.github/agents/business.agent.md');
      const uiUx = read('.github/agents/ui-ux.agent.md');
      const seo = read('.github/agents/seo-check.agent.md');
      return business.includes('Truth Over Guessing')
        && uiUx.includes('Truth-first policy')
        && seo.includes('Truth-first policy');
    },
    fix: 'Ensure business/ui-ux/seo-check agent files each include explicit truth-first language.',
  },
];

const failures = [];

for (const check of checks) {
  const passed = check.run();
  if (passed) {
    console.log(`PASS: ${check.name}`);
    continue;
  }

  console.log(`FAIL: ${check.name}`);
  failures.push(check);
}

if (failures.length > 0) {
  console.error(`\nQuality gate failed with ${failures.length} issue(s):`);
  for (const failure of failures) {
    console.error(`- ${failure.name}: ${failure.fix}`);
  }
  process.exit(1);
}

console.log('\nQuality gate passed.');
