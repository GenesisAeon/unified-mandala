export default {
  '*.{ts,tsx}': ['pnpm exec eslint --max-warnings=0', 'pnpm exec prettier --check'],
  '*.{md,yml,yaml}': 'pnpm exec prettier --check',
};
