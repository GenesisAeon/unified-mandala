import { describe, it, expect } from 'vitest';
import { PantheonPortalAnalytics } from './PantheonPortalAnalytics';

describe('PantheonPortalAnalytics', () => {
  it('tracks visits and events', () => {
    const analytics = new PantheonPortalAnalytics();
    analytics.recordVisit();
    analytics.recordVisit();
    analytics.recordEvent('open');
    analytics.recordEvent('open');
    analytics.recordEvent('close');
    expect(analytics.getStats()).toEqual({ visits: 2, events: { open: 2, close: 1 } });
  });
});
