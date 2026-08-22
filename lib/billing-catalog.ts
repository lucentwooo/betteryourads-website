/** Single source of truth for Loopy's plans. Consumed by the pricing UI,
 *  JSON-LD offers and anywhere prices are shown. Stripe mirrors these
 *  products/prices; change them here first. */

export type BillingPeriod = 'monthly' | 'quarterly' | 'annual';

export const PERIOD_MULTIPLIER: Record<BillingPeriod, number> = {
  monthly: 1,
  quarterly: 0.925, // −7.5%
  annual: 0.85, // −15%
};

export interface PaidPlan {
  id: 'starter' | 'agency';
  name: string;
  monthlyPrice: number;
  brands: number;
  rendersPerMonth: number;
  extraBrandMonthly: number;
}

export const PAID_PLANS: PaidPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 249,
    brands: 3,
    rendersPerMonth: 300,
    extraBrandMonthly: 79,
  },
  {
    id: 'agency',
    name: 'Agency',
    monthlyPrice: 499,
    brands: 10,
    rendersPerMonth: 1000,
    extraBrandMonthly: 49,
  },
];

export const FREE_PLAN = {
  name: 'Free',
  brands: 1,
  researchRuns: 1,
  lifetimeRenders: 10,
} as const;

export const STUDIO_PLAN = {
  name: 'Studio',
  minBrands: 25,
  rendersPerMonth: 2500,
} as const;

export function priceFor(plan: PaidPlan, period: BillingPeriod): number {
  return Math.round(plan.monthlyPrice * PERIOD_MULTIPLIER[period]);
}
