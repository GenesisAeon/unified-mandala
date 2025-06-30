let intervalMs = 6 * 3600 * 1000;

export function getInterval() {
  return intervalMs;
}

export function scheduleAdaptive(
  countFn: () => Promise<number>,
  run: () => Promise<void>
) {
  setTimeout(async () => {
    const newCount = await countFn();
    intervalMs = newCount > 10 ? 2 * 3600 * 1000 : 12 * 3600 * 1000;
    await run();
    scheduleAdaptive(countFn, run);
  }, intervalMs);
}
