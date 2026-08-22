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
  'A one-page ad creative brief template built for agencies running Meta ads: the brand header, ranked concept blocks with visual notes and three copy variations - plus a filled-in example.';

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

const HEADER_FIELDS: { name: string; why: string }[] = [
  {
    name: 'Campaign objective and the one number that matters',
    why: '“More sales” is not a metric. Name the objective (sales, leads, traffic) and the single result you will judge creative by - cost per purchase under $X. Every later decision bends around this line.',
  },
  {
    name: 'Audience and their awareness stage',
    why: 'Two or three segments written as people with a problem (“renters in Austin moving within 60 days”), then where they sit on the ladder: problem-aware, solution-aware or most-aware. Cold prospects need the problem named; comparison shoppers need differentiation.',
  },
  {
    name: 'About line and proof stats, quoted verbatim',
    why: 'One sentence of what the brand does plus the strongest verifiable proof - review counts, guarantees, certifications. Copy them word-for-word into the brief with any claim-verification notes attached, so designers paraphrase “trusted by 100,000+” into something legally wrong.',
  },
  {
    name: 'Measured brand facts',
    why: 'Fonts by role (“Playfair Display headers · Inter body”) and colours by job - text, accent, background, CTA, secondary - each with its exact hex. Not “make it feel premium”; “#FDF9F3 background, accent #C4622D”. Also link the logo file, product shots and customer-image sources here.',
  },
  {
    name: 'Dimensions and deliverables',
    why: 'Meta rejects ads for spec violations more than anything else. Name every size up front - feed 1080×1080, story 1080×1920 - and static vs video, with the due date.',
  },
  {
    name: 'Mandatories and exclusions',
    why: 'Legal lines, disclaimers, things the client never wants shown. Ten seconds here saves a compliance fire drill later - and gives you the support line every variation repeats identically.',
  },
];

const CONCEPT_FIELDS: { name: string; why: string }[] = [
  {
    name: 'A named angle, ranked',
    why: 'One persuasion angle per block - pain point, desire, proof - ordered by where it hits the audience’s awareness stage. One idea per concept; if a block needs two ideas it is two concepts.',
  },
  {
    name: 'A reference ad attached',
    why: 'Screenshot the proven ad whose layout the concept builds on - pulled from the client’s own category or a competitor library ranked by how long Meta kept each ad running. Long-running means tested; keep what the test validated instead of inventing from scratch.',
  },
  {
    name: 'Visual notes a designer can execute blind',
    why: 'KEEP / SWAP instructions: keep the layout, text-block arrangement and proven structure of the reference; swap imagery to the client’s world; apply the measured hexes and fonts from Part 1. Written so a freelancer who has never met the client ships on the first pass.',
  },
  {
    name: 'Three copy variations, emphasis marked',
    why: 'V1, V2, V3 - each a headline plus body working one idea, with the words to bold or accent-colour marked. Three variants let Meta’s algorithm find the angle while everything else stays constant.',
  },
];

const FAQS: FaqItem[] = [
  {
    q: 'What should an ad creative brief include?',
    a: 'Two halves: a skimmable brand header - objective with one success metric, audience and awareness stage, verbatim proof stats, measured fonts and hex colours, dimensions, mandatories - and one concept block per angle: a reference ad, visual notes, and three copy variations with emphasis marked.',
  },
  {
    q: 'How long should a creative brief be?',
    a: 'Half a page for the brand header, then roughly half a page per concept. A three-concept brief lands at about two pages - long enough to execute from, short enough that nobody skims past the success metric.',
  },
  {
    q: 'What are visual notes in a design brief?',
    a: 'Designer-executable KEEP/SWAP instructions tied to a reference ad: which parts of the proven layout stay, what imagery gets swapped, and the exact hex colours and fonts to apply. Good visual notes end revision loops because they answer questions before the designer asks them.',
  },
  {
    q: 'Why three copy variations per concept?',
    a: 'Because Meta optimizes by testing candidates against each other. Three headlines per concept isolate the message while the layout stays constant - the algorithm finds the winner faster than one bet-per-concept ever will.',
  },
  {
    q: 'Can AI write an ad creative brief?',
    a: 'It can produce the document in minutes, but quality depends entirely on the research behind it. Generic tools generate plausible filler from a prompt box. Research-first tools like Loopy measure the client’s live brand, mine customer reviews and competitor ads, rank angles by awareness stage, then draft the full brief - header, visual notes, variants and references included.',
  },
  {
    q: 'What is the difference between a creative brief and a media plan?',
    a: 'The creative brief decides what the ads say and look like - message, angles, brand, proof. The media plan decides where, when and at what budget they run. Agencies write briefs first; the plan spends money against what the brief promised.',
  },
  {
    q: 'Is a Facebook ad brief different from a regular creative brief?',
    a: 'Same document, tuned for Meta: deliverables are feed 1080×1080 and story 1080×1920, hooks matter more than headlines because the first line fights the scroll, and the brief should note placements since story crops punish designs made only for square.',
  },
  {
    q: 'How do we get client sign-off on a brief faster?',
    a: 'Send options, not blanks: present the concepts pre-ranked with a one-line rationale for each, attach the research that backs every recommendation, and cap revisions to one round. Clients approve faster when they are choosing between good answers instead of auditing guesses.',
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

type Row = { field: string; value?: string; wide?: boolean };

const HEADER_TEMPLATE: Row[] = [
  { field: 'Client / brand', value: 'name + one line on what they sell' },
  { field: 'Objective / success metric', value: 'sales · cost per purchase < $40' },
  { field: 'Audience', value: 'who, in one sentence, with a real problem' },
  { field: 'Awareness stage', value: 'problem-aware / solution-aware / most-aware' },
  { field: 'About + proof stats', value: 'one-line story + review count, guarantee - quoted verbatim' },
  { field: 'Website & assets', value: 'client URL · logo + product-shot links · customer-image source' },
  { field: 'Fonts', value: 'role-based, e.g. Playfair Display headers · Inter body' },
  { field: 'Colour scheme', value: 'text #… · accent #… · background #… · CTA #…' },
  { field: 'Dimensions', value: 'feed 1080×1080 · story 1080×1920 · due date' },
  { field: 'Mandatories', value: 'legal lines · disclaimers · never-show list' },
];

const CONCEPT_TEMPLATE: Row[] = [
  { field: 'Concept N · angle', value: 'pain point / desire / proof - ranked by awareness stage' },
  { field: 'Reference ad', value: 'screenshot of the proven layout this concept builds on' },
  { field: 'Visual notes', value: 'KEEP … / SWAP … / apply measured colours + fonts', wide: true },
  { field: 'V1–V3 copy', value: 'headline + body per variation, one idea each' },
  { field: 'Emphasis', value: 'which words get bold / accent colour per variant' },
  { field: 'Identical across variations', value: 'labels · sign-off · support/compliance lines' },
];

function TemplateCard({
  title,
  caption,
  rows,
}: {
  title: string;
  caption: string;
  rows: Row[];
}) {
  return (
    <div className={styles.template}>
      <p className={styles.templateCaption}>
        <strong>{title}</strong> — {caption}
      </p>
      {rows.map((row) =>
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
  );
}

const EXAMPLE_HEADER: Row[] = [
  { field: 'Client / brand', value: 'Hearthside Coffee Co. (fictional DTC roaster)' },
  { field: 'Objective / metric', value: 'Sales · cost per subscription start < $38' },
  { field: 'Audience', value: 'Home brewers who quit $6 café habits but miss the ritual' },
  { field: 'Awareness stage', value: 'Solution-aware - comparing subscriptions' },
  { field: 'Proof stats', value: '“12,000 five-star reviews” · “roasted-to-order” - quoted verbatim' },
  { field: 'Fonts · colours', value: 'Playfair headers · Inter | #3E2723 text · #C4622D accent · #FDF9F3 bg · #1E5B3F CTA' },
  { field: 'Dimensions', value: 'Feed 1080×1080 · Story 1080×1920' },
  { field: 'Mandatories', value: 'Subscription terms footer · never show steaming-mug stock shots' },
];

const EXAMPLE_CONCEPT: Row[] = [
  { field: 'Concept 1 · angle', value: 'Pain point - the café math' },
  { field: 'Reference ad', value: 'Split-screen price-comparison layout from a competitor, running 6+ months' },
  { field: 'Visual notes', value: 'KEEP the split-screen comparison layout. SWAP the right panel to a warm home pour-over scene; set background to #FDF9F3, put the monthly figure in accent #C4622D, Playfair Display headers throughout.', wide: true },
  { field: 'V1', value: 'Your $6 latte habit is costing you $126 a month.' },
  { field: 'V2', value: 'Baristas miss you. Your wallet doesn’t have to.' },
  { field: 'V3', value: 'Café ritual, home price - starting at $12 a bag.' },
  { field: 'Emphasis', value: '$126 / $12 a bag set in accent colour' },
  { field: 'Sign-off (identical)', value: 'First bag $1 - cancel anytime' },
  { field: 'Support (identical)', value: 'Subscription terms footer on every variation' },
];

function ExampleCard({ title, caption, rows }: { title: string; caption: string; rows: Row[] }) {
  return (
    <div className={`${styles.example}`}>
      <p className={styles.templateCaption}>
        <strong>{title}</strong> — {caption}
      </p>
      {rows.map((row) =>
        row.wide ? (
          <div key={row.field} className={styles.wideRowFilled}>
            <span className={styles.templateField}>{row.field}</span>
            <span className={styles.exampleValue}>{row.value}</span>
          </div>
        ) : (
          <div key={row.field} className={styles.templateRow}>
            <span className={styles.templateField}>{row.field}</span>
            <span className={styles.exampleValue}>{row.value}</span>
          </div>
        ),
      )}
    </div>
  );
}

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
              vacuum. This is the version built for outsourcing Meta ads work - a skimmable brand header, then one
              concept block per angle, each with a reference ad, visual notes and three copy variations. Steal it.
            </p>
          </div>
        </header>

        <section className={styles.prose}>
          <div className="wrap">
            <h2>What goes in an ad creative brief</h2>
            <p>
              An ad creative brief is the contract between strategy and design. It tells whoever makes the ads exactly{' '}
              <strong>what to say, who to say it to, and how success is measured</strong> - before a single pixel gets
              placed. Briefs that survive outsourcing all have the same two halves:
            </p>

            <h3 className={styles.partHead}>Part 1 - the brand header</h3>
            <ol className={styles.fields}>
              {HEADER_FIELDS.map((f, i) => (
                <li key={f.name}>
                  <h4>
                    <span className={styles.fieldNum}>{i + 1}.</span> {f.name}
                  </h4>
                  <p>{f.why}</p>
                </li>
              ))}
            </ol>

            <h3 className={styles.partHead}>Part 2 - one block per concept</h3>
            <ol className={styles.fields}>
              {CONCEPT_FIELDS.map((f, i) => (
                <li key={f.name}>
                  <h4>
                    <span className={styles.fieldNum}>{i + 7}.</span> {f.name}
                  </h4>
                  <p>{f.why}</p>
                </li>
              ))}
            </ol>

            <h2 id="template">Copy-paste template</h2>
            <p>Duplicate this into your project tool or client doc. If a field stays empty, the brief is not ready.</p>
            <TemplateCard
              title="Brand header"
              caption="once per campaign"
              rows={HEADER_TEMPLATE}
            />
            <TemplateCard
              title="Concept block"
              caption="repeat once per angle - usually 3"
              rows={CONCEPT_TEMPLATE}
            />

            <h2>Filled-in example (fictional brand)</h2>
            <p>
              What “done” looks like - notice the visual notes read like instructions, not suggestions, and every
              number is quoted verbatim so nobody paraphrases the legal out of it:
            </p>
            <ExampleCard title="Brand header" caption="Hearthside Coffee Co." rows={EXAMPLE_HEADER} />
            <ExampleCard title="Concept 1" caption="pain point" rows={EXAMPLE_CONCEPT} />

            <h2>Why most creative briefs fail</h2>
            <ul className={styles.failures}>
              <li>
                <strong>The 30-question intake form.</strong> Clients abandon them or answer in essays. Ten sharp
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
              <li>
                <strong>Visual notes that aren’t instructions.</strong> “Make it pop” starts a revision loop; “KEEP the
                layout, SWAP the photo, background #FDF9F3” ends it.
              </li>
            </ul>

            <h2>From brief to live ads</h2>
            <p>
              Traditionally the manual work starts after the template: pull competitor ads from the Meta Ad Library,
              rank what has been running, write the visual notes and variations, rebuild everything when the client
              edits round one. That whole loop - measuring the client’s real brand, ranking competitor-proven angles by
              awareness stage, drafting concept blocks with references and renders attached - is what{' '}
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
