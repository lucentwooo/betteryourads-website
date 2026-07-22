export interface Creative {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** Demo reskin, brand ad-01 (used by the hero ad wall). Most creatives are
 *  600×600; gusto/mailchimp ad-01 are 338×600 portrait. */
const wallAd = (brand: string, label: string, width = 600, height = 600): Creative => ({
  src: `/creatives/${brand}/ad-01.jpg`,
  alt: `Demo Meta ad reskinned into the ${label} brand`,
  width,
  height,
});

/** Hero ad wall, left column — drifts up on a 58s loop. */
export const HERO_WALL_A: Creative[] = [
  wallAd('asana', 'Asana'),
  wallAd('clickup', 'ClickUp'),
  wallAd('grammarly', 'Grammarly'),
  wallAd('kinsta', 'Kinsta'),
  wallAd('notion', 'Notion'),
  wallAd('slack', 'Slack'),
];

/** Hero ad wall, right column — drifts on a 74s reverse loop. */
export const HERO_WALL_B: Creative[] = [
  wallAd('chirp', 'Chirp'),
  wallAd('gusto', 'Gusto', 338, 600),
  wallAd('mailchimp', 'Mailchimp', 338, 600),
  wallAd('monday-com', 'monday.com'),
  wallAd('zapier', 'Zapier'),
  { src: '/creatives/notion/ad-03.jpg', alt: 'Second demo Meta ad in the Notion brand', width: 600, height: 600 },
];

/** Final-CTA background marquee — brand ad-02s plus one Salesgraph render.
 *  Decorative (rendered aria-hidden, cropped square). */
export const CTA_MARQUEE: Creative[] = [
  ...['asana', 'chirp', 'clickup', 'grammarly', 'gusto', 'kinsta', 'mailchimp', 'monday-com', 'notion', 'slack', 'zapier'].map(
    (brand): Creative => ({
      src: `/creatives/${brand}/ad-02.jpg`,
      alt: '',
      width: brand === 'mailchimp' ? 338 : 600,
      height: 600,
    }),
  ),
  { src: '/salesgraph/ad-4.png', alt: '', width: 1254, height: 1254 },
];
