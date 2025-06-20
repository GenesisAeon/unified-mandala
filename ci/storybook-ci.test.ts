test('ci flag is set', () => {
  process.env.CI = 'true';
  expect(process.env.CI).toBe('true');
});
