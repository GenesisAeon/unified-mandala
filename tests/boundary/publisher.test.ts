import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { publishBoundary, setBoundaryPublisher } from '../../src/boundary/publisher.js';
import { stableBoundaryEventKey } from '../../packages/boundary-core/src/event-key.js';

describe('publishBoundary', () => {
  const originalEndpoint = process.env.BOUNDARY_ENDPOINT;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    setBoundaryPublisher(null);
    vi.restoreAllMocks();
    delete process.env.BOUNDARY_ENDPOINT;
    if (originalFetch) {
      globalThis.fetch = originalFetch;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete (globalThis as Record<string, unknown>).fetch;
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
    setBoundaryPublisher(null);
    if (originalEndpoint) {
      process.env.BOUNDARY_ENDPOINT = originalEndpoint;
    } else {
      delete process.env.BOUNDARY_ENDPOINT;
    }
    if (originalFetch) {
      globalThis.fetch = originalFetch;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete (globalThis as Record<string, unknown>).fetch;
    }
  });

  afterAll(() => {
    setBoundaryPublisher(null);
    if (originalEndpoint) {
      process.env.BOUNDARY_ENDPOINT = originalEndpoint;
    } else {
      delete process.env.BOUNDARY_ENDPOINT;
    }
    if (originalFetch) {
      globalThis.fetch = originalFetch;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete (globalThis as Record<string, unknown>).fetch;
    }
  });

  it('derives the idempotency header when no eventKey is provided', async () => {
    process.env.BOUNDARY_ENDPOINT = 'http://127.0.0.1:4010';
    const fetchMock = vi.fn().mockResolvedValue({ ok: true } as Response);
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const law = {
      ts: '2025-12-08T10:00:00.000Z',
      source: 'test-suite',
      ruleId: 'rule-1',
      verdict: 'pass' as const,
      severity: 'ok' as const,
    };
    const expectedKey = stableBoundaryEventKey(law);

    await publishBoundary(law);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.headers).toMatchObject({
      'Content-Type': 'application/json',
      'Idempotency-Key': expectedKey,
    });
  });

  it('preserves a provided eventKey when it is already valid', async () => {
    process.env.BOUNDARY_ENDPOINT = 'http://127.0.0.1:4010';
    const fetchMock = vi.fn().mockResolvedValue({ ok: true } as Response);
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const eventKey = '1234567890123456789012345678901234567890';

    await publishBoundary({
      ts: '2025-12-08T10:00:00.000Z',
      source: 'test-suite',
      ruleId: 'rule-2',
      verdict: 'violation',
      severity: 'alarm',
      eventKey,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.headers).toMatchObject({
      'Content-Type': 'application/json',
      'Idempotency-Key': eventKey,
    });
  });
});
