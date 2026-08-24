import Image from 'next/image';
import styles from './BatchGrid.module.css';

type Tag = 'pain point' | 'desire' | 'objection' | 'scale';

interface Concept {
  /** concept number as it appears in the brief */
  n: number;
  tag: Tag;
  /** the reference structure the concept borrows, from its visual notes */
  format: string;
  /** V1-V3 headlines, verbatim from the brief */
  headlines: [string, string, string];
}

/** Five drafted concepts from one Loopy brief for svensisland.com.au
 *  ("Statics - 18 Aug 2026"), copied as written. */
const CONCEPTS: Concept[] = [
  {
    n: 1,
    tag: 'pain point',
    format: 'advertorial',
    headlines: [
      'Flare-up seemed worse? Calm by Day 8.',
      "5-month-old girl's eczema found relief.",
      'Parents say their 2am scratching finally stopped.',
    ],
  },
  {
    n: 2,
    tag: 'desire',
    format: 'our product vs other methods',
    headlines: [
      'Less Red, Less Swelling in 5 Days.',
      'Calmer Skin: No Steroids Needed.',
      'Mānuka & Kānuka: Visible Calm Skin.',
    ],
  },
  {
    n: 3,
    tag: 'objection',
    format: 'review card',
    headlines: [
      'Worried about cost? 60-Day Money-Back Guarantee.',
      'No more wasted money: 60-Day Money-Back guarantee.',
      'Doubtful another cream works? 60-day guarantee.',
    ],
  },
  {
    n: 4,
    tag: 'pain point',
    format: 'want vs try',
    headlines: [
      'Parents say 2am scratching finally stopped in 8 days.',
      "Soothe your child's itching, reclaim peaceful nights.",
      "Natural oils ended our child's 2am eczema battle.",
    ],
  },
  {
    n: 7,
    tag: 'scale',
    format: 'our way vs old way',
    headlines: [
      "Proactively reduce your child's eczema flare-ups tonight.",
      "Tired of eczema flares dictating your child's sleep?",
      'Proactively reduce eczema flare-ups; reclaim peaceful nights.',
    ],
  },
];

const TAG_CLASS: Record<Tag, string> = {
  'pain point': styles.tagPain,
  desire: styles.tagDesire,
  objection: styles.tagObjection,
  scale: styles.tagScale,
};

export function BatchGrid() {
  return (
    <section id="batch" className={styles.section}>
      <div className={styles.head}>
        <div>
          <p className="eyebrow">inside a loopy brief</p>
          <h2 className={styles.h2}>One brand. One brief. Five different arguments.</h2>
        </div>
        <p className={styles.headNote}>
          Every brief organizes distinct concepts by customer awareness stage - so when Meta burns out one ad, the
          next one makes a different case, not the same case in a new color.
        </p>
      </div>
      <figure className={styles.brief}>
        <div className={styles.briefFrame}>
          <Image
            src="/app/brief-concept.png"
            alt="One concept inside a Loopy brief for Svens Island: tagged pain point, the competitor reference ad it borrows structure from, visual notes for the designer, label and support copy, and three headline variations with the first one rendered"
            width={1720}
            height={1476}
            sizes="(max-width: 760px) 100vw, 880px"
            className={styles.briefShot}
          />
        </div>
        <figcaption className={styles.briefCaption}>
          one concept, as it appears in the brief - awareness stage, the reference it borrows structure from, visual
          notes for your designer, label and support copy, three headline variations, and the render. Brief for
          svensisland.com.au.
        </figcaption>
      </figure>
      <p className={styles.gridLabel}>the other arguments in the same brief - headlines as written, tagged by the case they make</p>
      <ul className={styles.grid}>
        {CONCEPTS.map((c) => (
          <li key={c.n} className={styles.concept}>
            <div className={styles.conceptHead}>
              <span className={`${styles.tag} ${TAG_CLASS[c.tag]}`}>{c.tag}</span>
              <span className={styles.conceptMeta}>
                concept {c.n} - {c.format}
              </span>
            </div>
            <ol className={styles.variations}>
              {c.headlines.map((h, i) => (
                <li key={h} className={styles.variation}>
                  <span className={styles.vLabel}>V{i + 1}</span>
                  <span className={styles.vText}>{h}</span>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ul>
      <p className={styles.fineprint}>real brief, real copy - shown as Loopy wrote it, nothing retouched</p>
    </section>
  );
}
