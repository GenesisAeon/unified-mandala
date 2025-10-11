import { writeFileSync } from 'node:fs';
const payload = process.env.SCAN_JSON ?? '{}';
writeFileSync('out/external_scan.json', payload);
console.log('external_scan.json stored');
