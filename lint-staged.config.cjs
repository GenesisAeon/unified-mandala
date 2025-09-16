module.exports = {
  'src/**/*.{ts,tsx,js,jsx,cjs,mjs}': ['pnpm exec eslint --max-warnings=0 --fix'],
  'apps/ui/**/*.{ts,tsx,js,jsx,cjs,mjs}': ['pnpm exec eslint --max-warnings=0 --fix'],
  'src/**/*.{json,md,css,scss}': ['pnpm exec prettier --write'],
  'apps/ui/**/*.{json,md,css,scss}': ['pnpm exec prettier --write'],
};
