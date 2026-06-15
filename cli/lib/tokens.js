// Build the token map from org config + the resolved answers.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function titleCase(name) {
  return name
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Display labels for standard slugs, used in the README adherence line.
const STANDARD_LABELS = {
  common: 'Common',
  'api-gem': 'API Gem',
  'app-rails': 'App (Rails)',
  'app-nextjs': 'App (Next.js)',
  tool: 'Tool',
};

// Pick the standard a repo adheres to from its answers (overridable via --standard).
export function deriveStandard(answers) {
  if (answers.standard) return answers.standard;
  if (answers.stack === 'ruby-gem' && /^api-/.test(answers.name || '')) return 'api-gem';
  // A JavaScript/React app on this org is a Next.js app — it gets the Next.js
  // flavour of the App standard. Other app/service types stay on App (Rails).
  if (['app', 'service'].includes(answers.type) && answers.stack === 'js-react') return 'app-nextjs';
  if (['app', 'service'].includes(answers.type)) return 'app-rails';
  if (answers.type === 'tool') return 'tool';
  return 'common';
}

// Resolve a stack's dependency chain (extends) into an ordered, de-duplicated list.
export function resolveStacks(stacksDir, primary, addons = []) {
  const ordered = [];
  const visit = (name) => {
    if (!name || ordered.includes(name)) return;
    const metaPath = join(stacksDir, name, 'stack.json');
    let meta = {};
    if (existsSync(metaPath)) meta = JSON.parse(readFileSync(metaPath, 'utf8'));
    if (meta.extends) visit(meta.extends); // base first
    if (!ordered.includes(name)) ordered.push(name);
  };
  visit(primary);
  for (const a of addons) visit(a);
  return ordered;
}

export function stackLabel(stacksDir, stacks) {
  const meta = (name) => {
    const p = join(stacksDir, name, 'stack.json');
    return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {};
  };
  // A base stack that a present stack extends is redundant in the label, so show
  // only the most specific (leaf) label, e.g. rails-hotwire, not "rails + rails-hotwire".
  const extendedBases = new Set(stacks.map((s) => meta(s).extends).filter(Boolean));
  return stacks
    .filter((s) => !extendedBases.has(s))
    .map((s) => meta(s).label || s)
    .join(' + ');
}

export function buildTokens(config, answers) {
  const org = config.org;
  const year = answers.year || String(new Date().getFullYear());
  const existing = answers.existingYear;
  const yearRange = existing && existing !== year ? `${existing}–${year}` : year;
  const standard = deriveStandard(answers);

  return {
    PROJECT_NAME: answers.name,
    PROJECT_TITLE: answers.title || titleCase(answers.name),
    TAGLINE: answers.tagline || '',
    DESCRIPTION: answers.description || '',
    TYPE: answers.type,
    STACK: answers.stack,
    STACK_LABEL: answers.stackLabel,
    LICENSE: answers.license,
    VISIBILITY: answers.visibility,
    ORG: org.handle,
    ORG_URL: org.url,
    REPO_URL: `${org.url}/${answers.name}`,
    LEGAL_NAME: org.legalName,
    AUTHOR: org.author,
    OWNER_HANDLE: org.ownerHandle || org.handle,
    EMAIL: org.email,
    WEBSITE: org.website,
    SECURITY_CONTACT: org.securityContact || org.email,
    YEAR: year,
    YEAR_RANGE: yearRange,
    STANDARD_SLUG: standard,
    STANDARD_LABEL: STANDARD_LABELS[standard] || titleCase(standard),
    STANDARD_VERSION: (config.standards || {})[standard] || 'v1',
  };
}

export { titleCase };
