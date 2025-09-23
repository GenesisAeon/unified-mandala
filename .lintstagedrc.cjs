module.exports = {
  '{scripts,services,src,tests}/**/*.{ts,tsx,js,jsx,cjs,mjs}': [
    'pnpm exec eslint --max-warnings=0 --fix',
    'pnpm exec prettier --write',
  ],
  '*.{json,yaml,yml,md,css,scss,html}': ['pnpm exec prettier --write'],
};
