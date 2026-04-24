#!/usr/bin/env node

/**
 * Syncs design tokens from tokens/core.json → styles/styles.css
 *
 * Usage: node scripts/sync-tokens.mjs
 *
 * Reads token values from the Tokens Studio JSON files and updates
 * the CSS custom properties in styles.css to match.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const core = JSON.parse(readFileSync(resolve(ROOT, 'tokens/core.json'), 'utf8'));

const TOKEN_TO_CSS = {
  'color.white': '--background-color',
  'color.black': '--text-color',
  'color.black_2': '--dark-color',
  'color.grey-darker': '--text-color-secondary',
  'color.grey-surface': '--light-color',
  'color.navy': '--brand-navy',
  'color.red': '--brand-red',
  'color.grey': '--brand-grey',
  'color.grey-darker_link': '--link-color',
  'color.black_link-hover': '--link-hover-color',
  'color.black_heading': '--heading-color',
  'color.white_heading-inv': '--heading-color-inverted',
  'color.grey-dark': '--text-color-muted',
  'color.grey-muted': '--text-color-light',
  'color.grey_border': '--border-color',
  'color.grey-light': '--border-color-light',
  'fontSize.body-m': '--body-font-size-m',
  'fontSize.body-s': '--body-font-size-s',
  'fontSize.body-xs': '--body-font-size-xs',
  'fontSize.heading-xxl-mobile': '--heading-font-size-xxl',
  'fontSize.heading-xl-mobile': '--heading-font-size-xl',
  'fontSize.heading-l-mobile': '--heading-font-size-l',
  'fontSize.heading-m-mobile': '--heading-font-size-m',
  'fontSize.heading-s': '--heading-font-size-s',
  'fontSize.heading-xs': '--heading-font-size-xs',
  'spacing.xs': '--spacing-xs',
  'spacing.s': '--spacing-s',
  'spacing.m': '--spacing-m',
  'spacing.l': '--spacing-l',
  'spacing.xl': '--spacing-xl',
  'spacing.xxl': '--spacing-xxl',
  'borderRadius.pill': '--border-radius-pill',
  'borderRadius.sm': '--border-radius-sm',
  'borderRadius.md': '--border-radius-md',
};

const DESKTOP_TOKENS = {
  'fontSize.heading-xxl-desktop': '--heading-font-size-xxl',
  'fontSize.heading-xl-desktop': '--heading-font-size-xl',
  'fontSize.heading-l-desktop': '--heading-font-size-l',
  'fontSize.heading-m-desktop': '--heading-font-size-m',
};

function getTokenValue(path) {
  const parts = path.split('.');
  let obj = core;
  for (const part of parts) {
    const key = part.replace(/_.*$/, '');
    if (!obj[key]) return null;
    obj = obj[key];
  }
  return obj.$value ?? null;
}

function formatValue(raw, prop) {
  if (raw == null) return null;
  const str = String(raw);
  if (str.startsWith('#') || str.startsWith('rgb') || str.startsWith('rgba')) return str;
  if (/^\d+(\.\d+)?$/.test(str) && prop.match(/font-size|spacing|radius|width|height/)) return `${str}px`;
  return str;
}

let css = readFileSync(resolve(ROOT, 'styles/styles.css'), 'utf8');
let changes = 0;

for (const [tokenPath, cssVar] of Object.entries(TOKEN_TO_CSS)) {
  const raw = getTokenValue(tokenPath);
  const val = formatValue(raw, cssVar);
  if (!val) continue;

  const regex = new RegExp(`(${cssVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*)([^;]+)(;)`);
  const match = css.match(regex);
  if (match && match[2].trim() !== val) {
    css = css.replace(regex, `$1${val}$3`);
    changes += 1;
    console.log(`  ${cssVar}: ${match[2].trim()} → ${val}`);
  }
}

for (const [tokenPath, cssVar] of Object.entries(DESKTOP_TOKENS)) {
  const raw = getTokenValue(tokenPath);
  const val = formatValue(raw, cssVar);
  if (!val) continue;

  const desktopBlock = css.match(/@media \(width >= 900px\) \{[\s\S]*?\n\}/);
  if (!desktopBlock) continue;

  const regex = new RegExp(`(${cssVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*)([^;]+)(;)`);
  const match = desktopBlock[0].match(regex);
  if (match && match[2].trim() !== val) {
    const updated = desktopBlock[0].replace(regex, `$1${val}$3`);
    css = css.replace(desktopBlock[0], updated);
    changes += 1;
    console.log(`  ${cssVar} (desktop): ${match[2].trim()} → ${val}`);
  }
}

if (changes > 0) {
  writeFileSync(resolve(ROOT, 'styles/styles.css'), css);
  console.log(`\n✓ Updated ${changes} CSS variable(s) in styles/styles.css`);
} else {
  console.log('✓ All CSS variables are already in sync with tokens.');
}
