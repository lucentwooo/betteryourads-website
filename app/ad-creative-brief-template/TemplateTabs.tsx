'use client';

import { useState } from 'react';
import styles from './page.module.css';

type Row = { field: string; value: string; wide?: boolean };

const HEADER_ROWS: Row[] = [
  { field: 'Client / brand', value: 'name + one line on what they sell' },
  { field: 'Objective / success metric', value: 'sales · cost per purchase < $40' },
  { field: 'Audience', value: 'who, in one sentence, with a real problem' },
  { field: 'Awareness stage', value: 'problem-aware / solution-aware / most-aware' },
  { field: 'About + proof stats', value: 'one-line story + review count, guarantee — quoted verbatim' },
  { field: 'Website & assets', value: 'client URL · logo + product-shot links · customer-image source' },
  { field: 'Fonts', value: 'role-based, e.g. Playfair Display headers · Inter body' },
  { field: 'Colour scheme', value: 'text #… · accent #… · background #… · CTA #…' },
  { field: 'Dimensions', value: 'feed 1080×1080 · story 1080×1920 · due date' },
  { field: 'Mandatories', value: 'legal lines · disclaimers · never-show list' },
];

const CONCEPT_ROWS: Row[] = [
  { field: 'Concept N · angle', value: 'pain point / desire / proof — ranked by awareness stage' },
  { field: 'Reference ad', value: 'screenshot of the proven layout this concept builds on' },
  { field: 'Visual notes', value: 'KEEP … / SWAP … / apply measured colours + fonts', wide: true },
  { field: 'V1–V3 copy', value: 'headline + body per variation, one idea each' },
  { field: 'Emphasis', value: 'which words get bold / accent colour per variant' },
  { field: 'Identical across variations', value: 'labels · sign-off · support/compliance lines' },
];

const TABS = [
  { key: 'header', label: 'Brand header', rows: HEADER_ROWS },
  { key: 'concept', label: 'Concept block', rows: CONCEPT_ROWS },
] as const;

function toPlainText(rows: Row[]): string {
  return rows.map((r) => `${r.field}: ${r.value}`).join('\n');
}

export function TemplateTabs() {
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('header');
  const [copied, setCopied] = useState(false);
  const active = TABS.find((t) => t.key === tab)!;

  async function copy() {
    try {
      await navigator.clipboard.writeText(toPlainText(active.rows));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — user can still select the text */
    }
  }

  return (
    <div className={styles.doc}>
      <div className={styles.chrome}>
        <span className={styles.chromeDots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={styles.chromeTitle}>creative-brief · template</span>
        <button type="button" onClick={copy} className={styles.copyBtn}>
          {copied ? 'copied ✓' : 'copy'}
        </button>
      </div>

      <div role="tablist" aria-label="Template parts" className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`${styles.tab}${tab === t.key ? ` ${styles.tabActive}` : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {active.rows.map((row) =>
          row.wide ? (
            <div key={row.field} className={styles.wideRow}>
              <span className={styles.templateField}>{row.field}</span>
              <span className={styles.templateHint}>{row.value}</span>
            </div>
          ) : (
            <div key={row.field} className={styles.templateRow}>
              <span className={styles.templateField}>{row.field}</span>
              <span className={styles.templateHint}>{row.value}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
