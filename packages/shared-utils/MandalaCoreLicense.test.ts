import { MandalaCoreLicense } from './MandalaCoreLicense';

test('generates license notice', () => {
  const lic = new MandalaCoreLicense('AeonOrg', 'CC-BY');
  const notice = lic.generateNotice({ module: 'core', rights: ['use'] });
  expect(notice).toContain('core');
  expect(notice).toContain('AeonOrg');
  expect(notice).toContain('CC-BY');
});
