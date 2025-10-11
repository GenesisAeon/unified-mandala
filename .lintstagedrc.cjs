module.exports = {
  '{scripts,services,src,tests}/**/*.{ts,tsx,js,jsx,cjs,mjs}': [
    'pnpm exec eslint --no-ignore --max-warnings=0 --fix --quiet',
    'pnpm exec prettier --ignore-unknown --write',
  ],
  '*.{json,yaml,yml,md,css,scss,html}': ['pnpm exec prettier --ignore-unknown --write'],
};
