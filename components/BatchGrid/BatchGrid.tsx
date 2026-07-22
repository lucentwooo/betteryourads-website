import Image from 'next/image';
import type { Creative } from '@/lib/creatives';
import styles from './BatchGrid.module.css';

interface BatchAd extends Creative {
  caption: string;
  /** the 5th ad starts at column 2 so the second row is centered */
  offset?: boolean;
}

const BATCH: BatchAd[] = [
  {
    src: '/salesgraph/ad-3.png',
    alt: 'Salesgraph ad made with Loopy, problem-aware angle: Missed deals from manual tracking?',
    caption: 'problem-aware · the cost of it',
    width: 1254,
    height: 1254,
  },
  {
    src: '/salesgraph/ad-6.png',
    alt: 'Salesgraph ad made with Loopy, solution-aware angle: Scale your sales workflow effortlessly.',
    caption: 'solution-aware · the outcome',
    width: 1254,
    height: 1254,
  },
  {
    src: '/salesgraph/ad-5.png',
    alt: 'Salesgraph ad made with Loopy, product-aware angle: Revenue agents with real human oversight.',
    caption: 'product-aware · the differentiator',
    width: 1254,
    height: 1254,
  },
  {
    src: '/salesgraph/ad-4.png',
    alt: 'Salesgraph ad made with Loopy, most-aware angle: Scale revenue with agents.',
    caption: 'most-aware · the proof',
    width: 1254,
    height: 1254,
  },
  {
    src: '/salesgraph/ad-2.png',
    alt: 'Salesgraph ad made with Loopy, unaware angle: Miss critical discovery questions?',
    caption: 'unaware · name the pain',
    width: 941,
    height: 1672,
    offset: true,
  },
  {
    src: '/salesgraph/ad-1.png',
    alt: 'Salesgraph ad made with Loopy, remix angle: 3X missed discovery gaps happen.',
    caption: 'remix · same pain, story format',
    width: 941,
    height: 1672,
  },
];

export function BatchGrid() {
  return (
    <section id="batch" className={styles.section}>
      <div className={styles.head}>
        <div>
          <p className="eyebrow">not one lucky render</p>
          <h2 className={styles.h2}>One brand. One batch. Six different arguments.</h2>
        </div>
        <p className={styles.headNote}>
          Loopy proposes distinct concepts by customer awareness stage - so when Meta burns out one ad, the next one
          makes a different case, not the same case in a new color.
        </p>
      </div>
      <div className={styles.grid}>
        {BATCH.map((ad) => (
          <figure key={ad.src} className={`${styles.figure}${ad.offset ? ` ${styles.offset}` : ''}`}>
            <Image src={ad.src} alt={ad.alt} width={ad.width} height={ad.height} className={styles.ad} />
            <figcaption className={styles.caption}>{ad.caption}</figcaption>
          </figure>
        ))}
      </div>
      <p className={styles.fineprint}>made with Loopy for salesgraph.com · every ad above is a real, unretouched render</p>
    </section>
  );
}
