/**
 * Real demo creatives: one reference ad → eight on-brand variations.
 * These are genuine generated ad examples (Zoom Workplace), used to show the
 * batch-creation output. Images live in /public/demo (pre-optimised to ~760px).
 */
export interface DemoAd {
  src: string;
  alt: string;
  /** Short SaaS-angle label shown as a caption in the demo. */
  angle: string;
}

export const REFERENCE_AD: DemoAd = {
  src: '/demo/zoom-ref.jpg',
  alt: 'Reference ad — Zoom Workplace: "Designed for how you actually work"',
  angle: 'reference',
};

export const VARIATION_ADS: DemoAd[] = [
  { src: '/demo/zoom-1.jpg', alt: 'Zoom Workplace ad — "Built-in AI. No extra cost."', angle: 'feature' },
  { src: '/demo/zoom-2.jpg', alt: 'Zoom Workplace ad — "Emmy-winning engineering."', angle: 'credibility' },
  { src: '/demo/zoom-3.jpg', alt: 'Zoom Workplace ad — "Your new AI note taker."', angle: 'use-case' },
  { src: '/demo/zoom-4.jpg', alt: 'Zoom Workplace ad — "Dream workflow achieved."', angle: 'aspiration' },
  { src: '/demo/zoom-5.jpg', alt: 'Zoom Workplace ad — "Cricut slashed calls by 90%."', angle: 'case study' },
  { src: '/demo/zoom-6.jpg', alt: 'Zoom Workplace ad — "No more 10-plus tabs."', angle: 'pain point' },
  { src: '/demo/zoom-7.jpg', alt: 'Zoom Workplace ad — "Stop talking. Start doing."', angle: 'manifesto' },
  { src: '/demo/zoom-8.jpg', alt: 'Zoom Workplace ad — "Trusted by millions. 4.5/5 stars."', angle: 'social proof' },
];

export const VARIATION_COUNT = VARIATION_ADS.length; // 8
