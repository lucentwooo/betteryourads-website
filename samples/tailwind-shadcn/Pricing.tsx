import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const tiers = [
  {
    name: 'founder', price: '$499', featured: false,
    pitch: 'For founders running their first paid social, or replacing a freelancer.',
    features: ['30 ads / month, shipped live', '1 brand, unlimited angles', 'Daily spend reallocation toward signups', 'Slack support, founder-to-founder'],
    footnote: 'private beta, 2026',
  },
  {
    name: 'scale', price: '$1,499', featured: true,
    pitch: 'For teams shipping ads daily, scaling beyond the founder plan.',
    features: ['120 ads / month, shipped live', '1 brand, unlimited angles', 'Daily reallocation + weekly creative refresh', 'Dedicated account, shared Slack with our team'],
    footnote: 'white-glove onboarding included',
  },
];

export function Pricing() {
  return (
    <section className="py-24 bg-bg text-fg" id="pricing">
      <div className="mx-auto max-w-[1240px] px-8">
        <div className="flex max-w-[760px] flex-col gap-[18px]">
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-fg-3">pricing</span>
          <h2 className="text-[clamp(34px,4vw,56px)] font-medium leading-[1.05] tracking-[-0.025em]">Two plans. No retainer.</h2>
          <p className="max-w-[640px] text-[17px] leading-relaxed text-fg-2">Pay for ads that ship, not for meetings. Month to month. Cancel any time.</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {tiers.map((t) => (
            <Card key={t.name} className={`rounded-[8px] border border-fg bg-bg p-9 ${t.featured ? 'border-t-4 border-t-accent' : ''}`}>
              <CardContent className="flex flex-col gap-[18px] p-0">
                <div className="flex items-center gap-[10px]">
                  <span className="text-sm font-semibold">{t.name}</span>
                  {t.featured && (
                    <span className="rounded-[2px] border border-accent px-[7px] py-[3px] text-[10px] font-semibold uppercase tracking-[0.1em] text-accent">most teams</span>
                  )}
                </div>
                <div className="flex items-baseline gap-2 text-[56px] font-medium leading-none tracking-[-0.03em]">
                  {t.price}<span className="text-[15px] font-medium text-fg-3">/ month</span>
                </div>
                <p className="min-h-[2.9em] text-[15px] leading-snug text-fg-2">{t.pitch}</p>
                <ul className="flex flex-col gap-[10px] border-t border-fg/10 pt-2">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-[10px] text-sm leading-snug">
                      <span className="mt-2 h-[5px] w-[5px] shrink-0 rounded-full bg-accent" />{f}
                    </li>
                  ))}
                </ul>
                <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-fg-3">{t.footnote}</span>
                <Button asChild className={`mt-auto w-full justify-center rounded-[4px] ${t.featured ? 'bg-accent text-bg hover:bg-accent-hover' : 'border border-fg bg-bg text-fg hover:bg-bg-raised'}`}>
                  <a href="#waitlist">join the waitlist</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
