import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav/Nav';
import { Faq, type FaqItem } from '@/components/Faq/Faq';
import { Footer } from '@/components/Footer/Footer';
import { CAL_URL } from '@/lib/site';
import styles from './page.module.css';

const PATH = '/ad-creative-brief-template';

const TITLE = 'Ad Creative Brief Template for Meta Ads (Free, Copy-Paste)';
const DESCRIPTION =
  'A one-page ad creative brief template built for agencies running Meta ads: the 8 fields to include, a copy-paste template, a filled-in example, and the failure modes to avoid.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: 'article',
    url: PATH,
    siteName: 'Loopy',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

const FIELDS: { name: string; why: string }[] = [
  {
    name: '1. Campaign objective and the one number that matters',
    why: '“More sales” is not a metric. Name the campaign objective (sales, leads, traffic) and the single result you will judge creative by - cost per purchase under $X, CPL under $Y. Every later decision bends around this line.',
  },
  {
    name: '2. Who the ad is for',
    why: 'Two or three audience segments max, written as people with a problem (“renters in Austin moving within 60 days”), not demographic spreadsheets. If you cannot picture one person reading the ad, the brief is not done.',
  },
  {
    name: '3. Where they are on the awareness ladder',
    why: 'Cold prospects need the problem named; comparison shoppers need differentiation; existing customers need a reason to return. A brief that skips this produces ads that say everything and persuade nobody.',
  },
  {
    name: '4. Brand facts, measured not remembered',
    why: 'Exact hex colors, fonts, logo files, tone in three adjectives. “Make it feel premium” starts revision loops; “matte black, uppercase headers, no exclamation marks” ends them.',
  },
  {
    name: '5. Offer and proof',
    why: 'What exactly is being offered (discount, trial, demo) and the strongest proof it works - a review count, a guarantee, a case-study number. Ads without proof read like noise.',
  },
  {
    name: '6. Angles worth testing',
    why: 'Three to five distinct persuasion angles (price, speed, status, fear-of-missing-out, identity). One idea per ad. This is the section clients argue over - settle it before design starts.',
  },
  {
    name: '7. Mandatories and exclusions',
    why: 'Legal lines, disclaimers, things the client never wants shown or said. Ten seconds here saves a compliance fire drill later.',
  },
  {
    name: '8. Deliverables and specs',
    why: 'Formats and sizes: feed 1:1 and 4:5, story 9:16, static vs video, file limits. Meta rejects ads for spec violations more often than for anything else.',
  },
];

const FAQS: FaqItem[] = [
  {
    q: 'What should an ad creative brief include?',
    a: 'Eight things: the campaign objective with one success metric, the target audience as real people, their awareness stage, measured brand facts (exact colors, fonts, tone), the offer plus its strongest proof, three to five test angles, mandatories and exclusions, and deliverable specs. That fits on one page.',
  },
  {
    q: 'How long should a creative brief be?',
    a: 'One page - roughly 400 words. Longer briefs get skimmed, and every fact that matters to the finished ad should be findable in under ten seconds.',
  },
  {
    q: 'What is the difference between a creative brief and a media plan?',
    a: 'The creative brief decides what the ads say and look like - message, angles, brand, proof. The media plan decides where, when and at what budget they run. Agencies write briefs first; the plan spends money against what the brief promised.',
  },
  {
    q: 'Can AI write an ad creative brief?',
    a: 'It can produce the document in minutes, but quality depends entirely on the research behind it. Generic tools generate plausible filler from a prompt. Research-first tools like Loopy read the client’s live site, mine customer and competitor data, then draft the brief - so the angles come from evidence, not invention.',
  },
  {
    q: 'Is a Facebook ad brief different from a regular creative brief?',
    a: 'Same document, tuned for Meta: deliverables are feed and story sizes, hooks matter more than headlines because the first line fights the scroll, and the brief should note placements since 9:16 story crops punish designs made only for square.',
  },
  {
    q: 'How do we get client sign-off on a brief faster?',
    a: 'Send options, not blanks: present the angles pre-ranked with a one-line rationale for each, cap revisions to one round, and attach the research that backs each recommendation. Clients approve faster when they are choosing between good answers instead of auditing guesses.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

const TEMPLATE_LINES: [string, string][] = [
  ['Client / brand', ''],
  ['Campaign objective', 'sales · leads · traffic'],
  ['Success metric', 'e.g. cost per purchase < $40'],
  ['Audience', 'who, in one sentence with a real problem'],
  ['Awareness stage', 'unaware / problem-aware / solution-aware / most-aware'],
  ['Brand facts', 'hex codes, fonts, logo file link, tone in 3 words'],
  ['Offer', 'what they get, price, deadline'],
  ['Proof', 'review count, guarantee, case-study number'],
  ['Test angles', 'angle 1 · angle 2 · angle 3 (+ winner criteria)'],
  ['Mandatories', 'legal lines, disclaimers, never-show list'],
  ['Deliverables', 'feed 1:1 + 4:5, story 9:16, static/video, due date'],
];

export default function BriefTemplatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
      />
      <Nav page="content" />
      <main>
        <header className={styles.hero}>
          <div className="wrap">
            <p className="eyebrow">Free resource</p>
            <h1 className={styles.h1}>The ad creative brief template agencies actually use</h1>
            <p className={styles.lede}>
              Most creative briefs fail the same way: thirty intake questions, no success metric, angles invented in a
              vacuum. This is the one-page version built for Meta ads - eight fields, a copy-paste template, and a
              filled-in example. Steal it.
            </p>
          </div>
        </header>

        <section className={styles.prose}>
          <div className="wrap">
            <h2>What goes in an ad creative brief</h2>
            <p>
              An ad creative brief is the contract between strategy and design. It tells whoever makes the ads exactly{' '}
              <strong>what to say, who to say it to, and how success is measured</strong> - before a single pixel gets
              placed. These are the eight fields that earn their space:
            </p>
            <ol className={styles.fields}>
              {FIELDS.map((f) => (
                <li key={f.name}>
                  <h3>{f.name}</h3>
                  <p>{f.why}</p>
                </li>
              ))}
            </ol>

            <h2 id="template">Copy-paste template</h2>
            <p>Duplicate this into your project tool or client doc. One page. If a field stays empty, the brief is not ready.</p>
            <div className={styles.template}>
              {TEMPLATE_LINES.map(([field, hint]) => (
                <div key={field} className={styles.templateRow}>
                  <span className={styles.templateField}>{field}</span>
                  <span className={styles.templateHint}>{hint || '—'}</span>
                </div>
              ))}
            </div>

            <h2>Filled-in example (fictional brand)</h2>
            <p>
              What “done” looks like - notice every entry is specific enough that a designer who has never met the
              client could ship from it:
            </p>
            <div className={styles.example}>
              <div className={styles.templateRow}>
                <span className={styles.templateField}>Client / brand</span>
                <span>Hearthside Coffee Co. (fictional DTC roaster)</span>
              </div>
              <div className={styles.templateRow}>
                <span className={styles.templateField}>Campaign objective</span>
                <span>Sales - new-subscriber push</span>
              </div>
              <div className={styles.templateRow}>
                <span className={styles.templateField}>Success metric</span>
                <span>Cost per subscription start &lt; $38</span>
              </div>
              <div className={styles.templateRow}>
                <span className={styles.templateField}>Audience</span>
                <span>Home brewers who quit $6 café habits but miss the ritual</span>
              </div>
              <div className={styles.templateRow}>
                <span className={styles.templateField}>Awareness stage</span>
                <span>Solution-aware - comparing subscriptions</span>
              </div>
              <div className={styles.templateRow}>
                <span className={styles.templateField}>Brand facts</span>
                <span>#3E2723 / #F4EDE1, serif headers, warm-honest voice</span>
              </div>
              <div className={styles.templateRow}>
                <span className={styles.templateField}>Offer</span>
                <span>First bag $1, cancel anytime, ends Sunday</span>
              </div>
              <div className={styles.templateRow}>
                <span className={styles.templateField}>Proof</span>
                <span>12,000 five-star reviews · roasted-to-order claim</span>
              </div>
              <div className={styles.templateRow}>
                <span className={styles.templateField}>Test angles</span>
                <span>Café math ($126/mo habit) · freshness window · morning ritual</span>
              </div>
              <div className={styles.templateRow}>
                <span className={styles.templateField}>Mandatories</span>
                <span>Subscription terms footer · never show steaming mug stock shots</span>
              </div>
              <div className={styles.templateRow}>
                <span className={styles.templateField}>Deliverables</span>
                <span>3 statics @ 1:1 + 4:5, 1 story 9:16, Friday EOD</span>
              </div>
            </div>

            <h2>Why most creative briefs fail</h2>
            <ul className={styles.failures}>
              <li>
                <strong>The 30-question intake form.</strong> Clients abandon them or answer in essays. Eight sharp
                fields beat thirty vague ones.
              </li>
              <li>
                <strong>No success metric.</strong> Without one number, feedback becomes taste. With one, feedback
                becomes “this won’t move cost-per-purchase.”
              </li>
              <li>
                <strong>Angles nobody researched.</strong> Brainstormed angles recycle what the client already says
                about themselves. The best angles come from customer reviews, competitor ads and support tickets.
              </li>
            </ul>

            <h2>From brief to live ads</h2>
            <p>
              Traditionally the brief is where the manual work starts: pull competitor ads from the Meta Ad Library,
              rank what has been running, draft concepts per awareness stage, then rebuild everything when the client
              edits round one. That whole loop - research, ranked concepts, client-ready brief, on-brand renders -
              is what{' '}
              <Link href="/" className="signal">
                Loopy automates
              </Link>
              : drop in the client’s URL, get the brief your designer would have taken a week to assemble.
            </p>
          </div>
        </section>

        <section className={styles.ctaBand}>
          <div className={`wrap ${styles.ctaInner}`}>
            <div>
              <h2>Want the brief written for you?</h2>
              <p>
                Your first client brief is free on a real client - research, ranked concepts and renders included, no
                card.
              </p>
            </div>
            <a href={CAL_URL} className={styles.ctaBtn}>
              book intro call <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <Faq title="Brief questions." items={FAQS} />
      </main>
      <Footer page="content" />
    </>
  );
}
