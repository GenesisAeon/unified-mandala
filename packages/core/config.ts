import path from 'path';

// Use runtime require to avoid type issues if dotenv types are missing
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

export const env = process.env;
