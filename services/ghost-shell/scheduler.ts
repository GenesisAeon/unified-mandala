let intervalMs = 6 * 3600 * 1000;

export function getInterval() {
  return intervalMs;
}

export function scheduleAdaptive(countFn: () => Promise<number>, run: () => Promise<void>) {
  let timeout: NodeJS.Timeout | undefined;
  let cancelled = false;

  const schedule = () => {
    timeout = setTimeout(async () => {
      const newCount = await countFn();
      intervalMs = newCount > 10 ? 2 * 3600 * 1000 : 12 * 3600 * 1000;
      await run();
      if (!cancelled) {
        schedule();
      }
    }, intervalMs);
  };

  schedule();

  return {
    cancel() {
      if (timeout) {
        clearTimeout(timeout);
      }
      cancelled = true;
    },
  };
}
