import { easeOutCubic } from './Counter';
describe('easeOutCubic', () => {
  it('clamps endpoints', () => { expect(easeOutCubic(0)).toBe(0); expect(easeOutCubic(1)).toBe(1); });
  it('eases out (past midpoint by 0.5)', () => { expect(easeOutCubic(0.5)).toBeGreaterThan(0.5); });
});
