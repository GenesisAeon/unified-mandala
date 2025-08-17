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
    expect(analytics.getStats()).toEqual({
      visits: 2,
      events: { open: 2, close: 1 },
      outcomeKPIs: { coherence: 0, resonance: 0, emergence: 0, poetics: 0 },
    });
  });

  it('maps CREP metrics to outcome KPIs', () => {
    const analytics = new PantheonPortalAnalytics();
    analytics.recordCREP({ coherence: 0.5, resonance: 0.6, emergence: 0.7, poetics: 0.8 });
    analytics.recordCREP({ coherence: 1, resonance: 0.4, emergence: 0.9, poetics: 0.2 });
    expect(analytics.getStats().outcomeKPIs).toEqual({
      coherence: 0.75,
      resonance: 0.5,
      emergence: 0.8,
      poetics: 0.5,
    });
  });
});
