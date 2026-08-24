import Image from 'next/image';
import styles from './Mechanism.module.css';

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
              <span className={styles.browserUrl}>svensisland.com.au</span>
            </div>
            <div className={styles.browserViewport}>
              <Image
                src="/app/site-svensisland.jpg"
                alt="The full svensisland.com.au page as Loopy scrolls and reads it"
                width={1440}
                height={7000}
                quality={85}
                sizes="(max-width: 760px) 100vw, 720px"
                className={styles.siteScroll}
              />
            </div>
          </div>
          <div className={styles.extracted}>
            <figure className={styles.extractedFigure}>
              <Image
                src="/app/brand-colors.png"
                alt="Loopy's brand profile for Svens Island: six measured colors with hex values, primary #232323, accent #6774A5, secondary #1F4034"
                width={568}
                height={626}
                sizes="(max-width: 760px) 50vw, 240px"
                className={styles.extractedShot}
              />
            </figure>
            <figure className={styles.extractedFigure}>
              <Image
                src="/app/brand-typography.png"
                alt="Loopy's brand profile for Svens Island: typography measured as Montserrat headings, Arial body"
                width={568}
                height={362}
                sizes="(max-width: 760px) 50vw, 240px"
                className={styles.extractedShot}
              />
            </figure>
            <span className={styles.extractedNote}>
              what Loopy measured - <b>brand profile</b>, Svens Island
            </span>
          </div>
        </div>
      </div>

      {/* 02 — customer research */}
      <div className={`${styles.card} ${styles.card2}`}>
        <div>
          <span className={`${styles.badge} ${styles.badgePeriwinkle}`}>02 - real research</span>
          <h3 className={styles.h3}>It researches who buys, and why, before writing a word.</h3>
          <p className={`${styles.body} ${styles.bodyOnDark}`}>
            Before a single concept, Loopy researches the client&rsquo;s market: who the buyer is, what triggers
            them, what they object to, and what they do instead. It all lives in the brand hub, so every angle in the
            brief traces back to a real reason - not a guess.
          </p>
        </div>
        <div className={styles.visual2}>
          <figure className={styles.researchFigure}>
            <Image
              src="/app/research-customers-v2.png"
              alt="Loopy's customer research for Svens Island: who buys, the triggers (a current eczema flare-up, a child with eczema), and objections (scepticism about another cream, concern about steroids)"
              width={716}
              height={590}
              sizes="(max-width: 760px) 80vw, 340px"
              className={styles.researchShot}
            />
            <figcaption className={styles.pairCaption}>research tab - customers, Svens Island</figcaption>
          </figure>
        </div>
      </div>

      {/* 03 — ranked concepts → brief */}
      <div className={`${styles.card} ${styles.card3}`}>
        <div>
          <span className={`${styles.badge} ${styles.badgeCoral}`}>03 - ranked, then briefed</span>
          <h3 className={styles.h3}>Concepts ranked by expected performance. You tick, it briefs.</h3>
          <p className={styles.body}>
            From that research Loopy drafts concepts for every awareness stage - cold, comparing, ready to buy - and
            ranks them, with the reason for each rank in plain English. Tick the ones worth sending to a designer and
            the brief holds them all: copy variations, references, visual notes.
          </p>
        </div>
        <div className={styles.visual3}>
          <Image
            src="/app/board-stages.png"
            alt="Stage tabs on the board: cold audiences, comparing options, ready to buy"
            width={740}
            height={60}
            sizes="(max-width: 760px) 70vw, 300px"
            className={styles.stagesShot}
          />
          <div className={styles.boardFrame}>
            <Image
              src="/app/board-ranked-v2.png"
              alt="The board for Svens Island: concepts ranked by expected performance - #1 proof, 2,800+ five-star reviews; #2 proof, only cream that soothes itch; #3 objection, 60-day money-back guarantee - each with its reasoning"
              width={1300}
              height={384}
              sizes="(max-width: 760px) 100vw, 500px"
              className={styles.boardShot}
            />
          </div>
          <span className={styles.caption}>
            <span className={styles.refMark}>▲</span>the board - 15 concepts ranked for Svens Island, reasons included
          </span>
        </div>
      </div>

      {/* 04 — the loop */}
      <div className={`${styles.card} ${styles.card4}`}>
        <div>
          <span className={`${styles.badge} ${styles.badgeViolet}`}>04 - the loop, beta</span>
          <h3 className={styles.h3}>And it keeps learning, run after run.</h3>
          <p className={styles.body}>
            Every run reads the client&rsquo;s site, reviews and forums, banks the customer language word for word,
            and distills it into pains, objections, failed alternatives and proof - each weighted by how many real
            verbatims back it. The next brief argues from what&rsquo;s strongest. Connect Meta read-only and what
            actually performed joins that evidence. It&rsquo;s early, and it&rsquo;s live.
          </p>
        </div>
        <div className={styles.visual4}>
          <div className={styles.loopFrame}>
            <Image
              src="/app/research-insights-v2.png"
              alt="Loopy's research insights for superhuman.com, strongest evidence first: four pains (documentation scattered across tools, 30-40 emails a day), four failed alternatives (Gmail with shortcut hacks), six objections (price too high at $30 a month - 6 verbatims; iPad experience neglected - 4 verbatims), each with an evidence-strength meter and verbatim count, re-distilled each run"
              width={1650}
              height={1470}
              sizes="(max-width: 760px) 100vw, 600px"
              className={styles.loopShot}
            />
          </div>
          <span className={styles.caption}>
            <span className={styles.loopMark}>●</span>research insights - 20 insights from 37 customer verbatims, 35
            pages read - superhuman.com
          </span>
        </div>
      </div>

    </section>
  );
}
