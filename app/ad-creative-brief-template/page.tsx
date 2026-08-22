import type { Metadata } from 'next';
import { Nav } from '@/components/Nav/Nav';
import { Faq, type FaqItem } from '@/components/Faq/Faq';
import { Footer } from '@/components/Footer/Footer';
import { CAL_URL } from '@/lib/site';
import { TemplateTabs } from './TemplateTabs';
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
    why: '“More sales” is not a metric. Name the objective and the single result you will judge creative by - cost per purchase under $X. Every later decision bends around this line.',
  },
  {
    name: 'Audience and their awareness stage',
    why: 'Two or three segments written as people with a problem, then where they sit on the ladder: problem-aware, solution-aware or most-aware. Cold prospects need the problem named; comparison shoppers need differentiation.',
  },
  {
    name: 'About line and proof stats, quoted verbatim',
    why: 'One sentence of what the brand does plus the strongest verifiable proof - review counts, guarantees, certifications. Copy them word-for-word into the brief so nobody paraphrases “trusted by 100,000+” into something legally wrong.',
  },
  {
    name: 'Measured brand facts',
    why: 'Fonts by role (“Playfair Display headers · Inter body”) and colours by job - text, accent, background, CTA - each with its exact hex. Also link the logo file, product shots and customer-image sources here.',
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
    why: 'One persuasion angle per block - pain point, desire, proof - ordered by where it hits the audience’s awareness stage. If a block needs two ideas it is two concepts.',
  },
  {
    name: 'A reference ad attached',
    why: 'Screenshot the proven ad whose layout the concept builds on - pulled from the client’s category or a competitor library ranked by how long Meta kept each ad running. Long-running means tested.',
  },
  {
    name: 'Visual notes a designer can execute blind',
    why: 'KEEP / SWAP instructions: keep the layout and text-block arrangement of the reference, swap imagery to the client’s world, apply the measured hexes and fonts. Written so a freelancer who has never met the client ships on the first pass.',
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

const TOC = [
  ['anatomy', 'The anatomy'],
  ['template', 'Copy the template'],
  ['example', 'Filled-in example'],
  ['failures', 'Why briefs fail'],
  ['faq', 'FAQ'],
] as const;

function Sw({ hex }: { hex: string }) {
  return (
    <span className={styles.sw}>
      <i aria-hidden="true" style={{ background: hex }} />
      <span>{hex}</span>
    </span>
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
          <div className={`wrap ${styles.heroInner}`}>
            <p className={`${styles.heroEyebrow} ${styles.reveal}`}>Free resource · steal this</p>
            <h1 className={`${styles.h1} ${styles.reveal}`} style={{ animationDelay: '80ms' }}>
              The ad creative brief template agencies actually use<span className={styles.dot}>.</span>
            </h1>
            <p className={`${styles.lede} ${styles.reveal}`} style={{ animationDelay: '160ms' }}>
              Most briefs fail the same way: thirty intake questions, no success metric, angles invented in a vacuum.
              This is the version built for outsourcing Meta ads work - a skimmable brand header, then one concept
              block per angle, each with a reference ad, visual notes and three copy variations.
            </p>
            <div className={`${styles.heroMeta} ${styles.reveal}`} style={{ animationDelay: '240ms' }}>
              <span>10 fields</span>
              <i aria-hidden="true" />
              <span>2-part anatomy</span>
              <i aria-hidden="true" />
              <span>copy-paste ready</span>
              <i aria-hidden="true" />
              <span>worked example</span>
            </div>

            {/* decorative mini-brief stack — desktop only */}
            <div className={styles.heroArt} aria-hidden="true">
              <div className={`${styles.artCard} ${styles.artCardA}`}>
                <span className={`${styles.artBadge} ${styles.artBadgeBlue}`}>header</span>
                <b style={{ background: '#C4622D' }} />
                <b style={{ background: '#3E2723' }} />
                <b style={{ background: '#FDF9F3' }} />
                <em>objective</em>
              </div>
              <div className={`${styles.artCard} ${styles.artCardB}`}>
                <span className={`${styles.artBadge} ${styles.artBadgeCoral}`}>concept</span>
                <u />
                <u />
                <strong>V1 · V2 · V3</strong>
              </div>
            </div>
          </div>
        </header>

        <div className={`wrap ${styles.shell}`}>
          <aside className={styles.rail} aria-label="On this page">
            <span className={styles.railLabel}>On this page</span>
            {TOC.map(([id, label], i) => (
              <a key={id} href={`#${id}`} className={styles.railLink}>
                <b>{String(i + 1).padStart(2, '0')}</b> {label}
              </a>
            ))}
          </aside>

          <article className={styles.article}>
            <section id="anatomy" className={styles.section}>
              <h2>The anatomy</h2>
              <p className={styles.sectionLede}>
                An ad creative brief is the contract between strategy and design. Briefs that survive outsourcing all
                have the same two halves:
              </p>

              <div className={styles.part}>
                <span className={styles.ghost} aria-hidden="true">1</span>
                <h3>The brand header</h3>
                <ol className={styles.specList}>
                  {HEADER_FIELDS.map((f, i) => (
                    <li key={f.name}>
                      <b className={styles.specNum}>{String(i + 1).padStart(2, '0')}</b>
                      <div>
                        <h4>{f.name}</h4>
                        <p>{f.why}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className={styles.part}>
                <span className={styles.ghost} aria-hidden="true">2</span>
                <h3>One block per concept</h3>
                <ol className={styles.specList}>
                  {CONCEPT_FIELDS.map((f, i) => (
                    <li key={f.name}>
                      <b className={styles.specNum}>{String(i + 7).padStart(2, '0')}</b>
                      <div>
                        <h4>{f.name}</h4>
                        <p>{f.why}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section id="template" className={styles.section}>
              <h2>Copy-paste template</h2>
              <p className={styles.sectionLede}>
                Duplicate into your project tool or client doc. Switch between the two parts below, or copy the whole
                thing as text.
              </p>
              <TemplateTabs />
            </section>

            <section id="example" className={styles.section}>
              <h2>Filled-in example</h2>
              <p className={styles.sectionLede}>
                What &ldquo;done&rdquo; looks like. Fictional brand - but notice how every entry is specific enough
                that a designer who has never met the client could ship from it.
              </p>

              <div className={styles.doc}>
                <div className={styles.chrome}>
                  <span className={styles.chromeDots} aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className={styles.chromeTitle}>Hearthside Coffee Co. | 3 statics · concept 1 of 3</span>
                  <span className={styles.statusPill}>brief ready</span>
                </div>

                <div className={styles.docHead}>
                  <div>
                    <span className={styles.templateField}>About + proof (verbatim)</span>
                    <p>
                      Small-batch DTC roaster. “12,000 five-star reviews” · “roasted-to-order” - quoted exactly, never
                      paraphrased onto ads.
                    </p>
                  </div>
                  <div className={styles.swatchRow}>
                    <span className={styles.templateField}>Measured palette</span>
                    <Sw hex="#3E2723" />
                    <Sw hex="#C4622D" />
                    <Sw hex="#FDF9F3" />
                    <Sw hex="#1E5B3F" />
                  </div>
                </div>

                <div className={styles.templateRow}>
                  <span className={styles.templateField}>Objective / metric</span>
                  <span>Sales · cost per subscription start &lt; $38</span>
                </div>
                <div className={styles.templateRow}>
                  <span className={styles.templateField}>Audience · stage</span>
                  <span>Home brewers who quit $6 café habits but miss the ritual · solution-aware</span>
                </div>
                <div className={styles.wideRow}>
                  <span className={styles.templateField}>Visual notes</span>
                  <p className={styles.notesText}>
                    <b className={styles.keepChip}>KEEP</b> the split-screen comparison layout and text-block
                    arrangement. <b className={styles.swapChip}>SWAP</b> the right panel to a warm home pour-over
                    scene; background #FDF9F3, monthly figure in accent #C4622D, Playfair Display headers throughout.
                  </p>
                </div>

                <div className={styles.vGrid}>
                  <div className={styles.vCard}>
                    <span className={`${styles.vPill} ${styles.v1}`}>V1</span>
                    <p>Your $6 latte habit is costing you <b className={styles.accentWord}>$126</b> a month.</p>
                  </div>
                  <div className={styles.vCard}>
                    <span className={`${styles.vPill} ${styles.v2}`}>V2</span>
                    <p>Baristas miss you. Your wallet doesn&rsquo;t have to.</p>
                  </div>
                  <div className={styles.vCard}>
                    <span className={`${styles.vPill} ${styles.v3}`}>V3</span>
                    <p>Café ritual, home price - starting at <b className={styles.accentWord}>$12</b> a bag.</p>
                  </div>
                </div>

                <div className={styles.identicalBand}>
                  <span className={styles.templateField}>Identical across variations</span>
                  <span>
                    Sign-off: “First bag $1 - cancel anytime” · Support: subscription terms footer on every render
                  </span>
                </div>
              </div>
            </section>

            <section id="failures" className={styles.section}>
              <h2>Why most creative briefs fail</h2>
              <ol className={styles.failList}>
                <li>
                  <b>01</b>
                  <div>
                    <h4>The 30-question intake form</h4>
                    <p>Clients abandon them or answer in essays. Ten sharp fields beat thirty vague ones.</p>
                  </div>
                </li>
                <li>
                  <b>02</b>
                  <div>
                    <h4>No success metric</h4>
                    <p>Without one number, feedback becomes taste. With one, feedback becomes “this won’t move cost-per-purchase.”</p>
                  </div>
                </li>
                <li>
                  <b>03</b>
                  <div>
                    <h4>Angles nobody researched</h4>
                    <p>Brainstormed angles recycle what the client already says about themselves. The best angles come from customer reviews, competitor ads and support tickets.</p>
                  </div>
                </li>
                <li>
                  <b>04</b>
                  <div>
                    <h4>Visual notes that aren’t instructions</h4>
                    <p>“Make it pop” starts a revision loop. “KEEP the layout, SWAP the photo, background #FDF9F3” ends it.</p>
                  </div>
                </li>
              </ol>
            </section>

            <section className={styles.ctaBand}>
              <h2>Want the brief written for you?</h2>
              <p>
                Your first client brief is free on a real client - research, ranked concepts and renders included, no
                card.
              </p>
              <a href={CAL_URL} className={styles.ctaBtn}>
                book intro call <span aria-hidden="true">↗</span>
              </a>
            </section>
          </article>
        </div>

        <Faq title="Brief questions." items={FAQS} />
      </main>
      <Footer page="content" />
    </>
  );
}
