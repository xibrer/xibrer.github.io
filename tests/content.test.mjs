import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { entries as parseBibTeXEntries } from 'bibtex-parse';
import { validateContent } from '../scripts/validate-content.mjs';

test('content configuration and local assets are valid', () => {
  assert.deepEqual(validateContent(), {
    locales: 2,
    publications: 4,
    navigationItems: 5,
  });
});

test('publication citation keys are unique and stable', () => {
  const bibtex = fs.readFileSync(path.join(process.cwd(), 'content/publications.bib'), 'utf8');
  const publications = parseBibTeXEntries(bibtex);
  const keys = publications.map((publication) => publication.key);

  assert.equal(new Set(keys).size, keys.length);
  assert.deepEqual(keys.sort(), [
    'wang2023ecg',
    'wang2024bp',
    'wang2025acccall',
    'wang2026largecall',
  ]);
});
