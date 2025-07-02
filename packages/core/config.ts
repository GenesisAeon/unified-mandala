import path from 'path';

// Load dotenv only if available to avoid optional dependency issues
let dotenv: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  dotenv = require('dotenv');
} catch {
  dotenv = null;
}
if (dotenv) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

export const env = process.env;
