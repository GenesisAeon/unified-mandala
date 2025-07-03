import fs from 'fs';

test('SocietyGPT Teamboard exists', () => {
  const text = fs.readFileSync('docs/teamboards/SocietyGPT_Teamboard.md', 'utf8');
  expect(text).toMatch(/SocietyGPT Teamboard/);
});
