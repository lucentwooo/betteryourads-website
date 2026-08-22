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
      <p className="eyebrow">no black box</p>
      <h2 className={styles.h2}>Grounded in your client&rsquo;s reality. Not guesses.</h2>

      {/* 01 — measured, not guessed */}
      <div className={`${styles.card} ${styles.card1}`}>
        <div>
          <span className={`${styles.badge} ${styles.badgeBlue}`}>01 - measured, not guessed</span>
          <h3 className={styles.h3}>It reads your client&rsquo;s actual brand from their live site.</h3>
          <p className={styles.body}>
            Loopy opens the client&rsquo;s website the way a person would and writes down exactly what it sees: the
            colors they use most, their fonts, their logo. Nothing is guessed. Every concept and brief starts from who
            they actually are.
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
            <span className={styles.chip}>Source Serif</span>
            <span className={styles.chip}>logo ✓</span>
          </div>
        </div>
      </div>

      {/* 02 — software-safe */}
      <div className={`${styles.card} ${styles.card2}`}>
        <div>
          <span className={`${styles.badge} ${styles.badgePeriwinkle}`}>02 - nothing invented</span>
          <h3 className={styles.h3}>Nothing invented. Anywhere.</h3>
          <p className={`${styles.body} ${styles.bodyOnDark}`}>
            Research comes only from what&rsquo;s real: the client&rsquo;s live site and the materials you upload.
            Their product images are placed pixel-for-pixel, never redrawn or hallucinated. Nothing in the brief - or
            the creative - is made up.
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
          <span className={`${styles.badge} ${styles.badgeCoral}`}>03 - competitor intel</span>
          <h3 className={styles.h3}>Concepts built on ads Meta kept running.</h3>
          <p className={styles.body}>
            Loopy maintains a library of real competitor ads ranked by how long Meta kept each one live - a survival
            signal, not a guess. Concepts borrow the structure that earned the run, so every angle in your brief stands
            on something that already worked.
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
            <figcaption className={styles.caption}>
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
            <figcaption className={styles.caption}>same structure - your brand</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
