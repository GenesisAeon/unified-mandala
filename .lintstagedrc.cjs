module.exports = {
  // TS/JS: run eslint once with cache; then format those files with Prettier
  '{scripts,services,src,tests}/**/*.{ts,tsx,js,jsx,cjs,mjs}': (files) => [
    `node --max-old-space-size=4096 ./node_modules/eslint/bin/eslint.js --no-ignore --max-warnings=0 --fix --quiet --cache --cache-location node_modules/.cache/eslint ${files.join(' ')}`,
    `node --max-old-space-size=4096 ./node_modules/prettier/bin/prettier.cjs --ignore-unknown --write ${files.join(' ')}`,
  ],
  // Text assets: format each file individually to minimize peak memory
  '*.{json,yaml,yml,md,css,scss,html}': (files) =>
    files.map((f) => `node --max-old-space-size=4096 ./node_modules/prettier/bin/prettier.cjs --ignore-unknown --write "${f}"`),
};
