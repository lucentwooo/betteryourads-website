import Image from 'next/image';
import styles from './Mechanism.module.css';

const SWATCHES = [
  { hex: '#233118', border: false },
  { hex: '#f7f3e7', border: true },
  { hex: '#f2c445', border: false },
] as const;

export function Mechanism() {
  return (
    <section id="how" className={styles.section}>
      <p className="eyebrow">why it won&apos;t look like AI slop</p>
      <h2 className={styles.h2}>Three reasons the output looks like you made it.</h2>

      {/* 01 — measured, not guessed */}
      <div className={`${styles.card} ${styles.card1}`}>
        <div>
          <span className={`${styles.badge} ${styles.badgeBlue}`}>01 - measured, not guessed</span>
          <h3 className={styles.h3}>It copies your exact colors, fonts and logo from your website.</h3>
          <p className={styles.body}>
            Loopy opens your website the way a person would and writes down exactly what it sees: the colors you use
            most, your fonts, your logo. Nothing is guessed. That&apos;s why the ads look like you, not like AI.
          </p>
        </div>
        <div className={styles.visual1}>
          <div className={styles.browser}>
            <div className={styles.browserBar}>
              <span className={styles.browserDot} />
              <span className={styles.browserDot} />
              <span className={styles.browserUrl}>salesgraph.com</span>
            </div>
            <div className={styles.browserViewport}>
              <Image
                src="/salesgraph/site-full.jpg"
                alt="The full salesgraph.com page as Loopy scrolls and reads it"
                width={1440}
                height={6800}
                quality={90}
                sizes="(max-width: 760px) 100vw, 720px"
                className={styles.siteScroll}
              />
            </div>
          </div>
          <div className={styles.chips}>
            {SWATCHES.map((s) => (
              <span key={s.hex} className={styles.chip}>
                <i className={styles.swatch} style={{ background: s.hex, border: s.border ? '1px solid var(--border)' : undefined }} />
                {s.hex}
              </span>
            ))}
            <span className={styles.chip}>font - Source Serif</span>
            <span className={styles.chip}>logo ✓</span>
          </div>
        </div>
      </div>

      {/* 02 — software-safe */}
      <div className={`${styles.card} ${styles.card2}`}>
        <div>
          <span className={`${styles.badge} ${styles.badgePeriwinkle}`}>02 - software-safe</span>
          <h3 className={styles.h3}>Your screenshots placed exactly. Never invented UI.</h3>
          <p className={`${styles.body} ${styles.bodyOnDark}`}>
            Where other tools hallucinate a fake dashboard for your product, Loopy places your real screenshot
            pixel-for-pixel. If it shows your product, it is your product. This is where AI ad tools usually fail for
            software - it&apos;s the reason we exist.
          </p>
        </div>
        <div className={styles.visual2}>
          <div className={styles.pair}>
            <figure className={styles.pairFigure}>
              <Image
                src="/salesgraph/ui.png"
                alt="A real Salesgraph product screenshot: the pre-call brief"
                width={1086}
                height={840}
                className={styles.uiShot}
              />
              <figcaption className={styles.pairCaption}>your screenshot</figcaption>
            </figure>
            <span aria-hidden="true" className={styles.equals}>
              =
            </span>
            <figure className={styles.pairFigure}>
              <Image
                src="/salesgraph/ad-4.png"
                alt="The finished Salesgraph ad with that exact screenshot placed inside, untouched"
                width={1254}
                height={1254}
                className={styles.adShot}
              />
              <figcaption className={styles.pairCaption}>the same pixels, in your ad</figcaption>
            </figure>
          </div>
          <span className={styles.neverRedrawn}>never redrawn</span>
        </div>
      </div>

      {/* 03 — proven structure */}
      <div className={`${styles.card} ${styles.card3}`}>
        <div>
          <span className={`${styles.badge} ${styles.badgeCoral}`}>03 - proven structure</span>
          <h3 className={styles.h3}>Layouts borrowed from ads Meta kept running.</h3>
          <p className={styles.body}>
            You start from a library of real competitor ads ranked by how long Meta kept them live - a survival signal,
            not a guess. Loopy keeps the structure that earned that run and swaps in your brand. When the two disagree,
            your brand wins.
          </p>
        </div>
        <div className={styles.pair3}>
          <figure className={styles.refFigure}>
            <Image
              src="/reference/canva-ad.jpg"
              alt="The reference: a long-running Canva ad from the library"
              width={1080}
              height={1920}
              className={styles.refAd}
            />
            <figcaption className={styles.monoCaption}>
              <span className={styles.refMark}>▲</span>the reference
            </figcaption>
          </figure>
          <span aria-hidden="true" className={styles.arrow3}>
            →
          </span>
          <figure className={styles.reskinFigure}>
            <Image
              src="/salesgraph/ad-4.png"
              alt="The same structure reskinned into the Salesgraph brand"
              width={1254}
              height={1254}
              className={styles.refAd}
            />
            <figcaption className={styles.monoCaption}>same structure - your brand</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
