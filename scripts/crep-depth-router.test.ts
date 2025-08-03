import { routeByDepth } from './crep-depth-router';

describe('routeByDepth', () => {
  it('routes shallow depths', () => {
    expect(routeByDepth(5)).toBe('shallow');
  });

  it('routes medium depths', () => {
    expect(routeByDepth(15)).toBe('medium');
  });

  it('routes deep depths', () => {
    expect(routeByDepth(25)).toBe('deep');
  });
});
