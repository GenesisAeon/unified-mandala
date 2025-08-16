import { describe, it, expect } from 'vitest';
import { repositoryMapToHtml } from './repository-map-html';

describe('repositoryMapToHtml', () => {
  it('renders aeon repository and its modules', () => {
    const html = repositoryMapToHtml();
    expect(html).toContain('<td>aeon</td>');
    expect(html).toContain('sigillin-validator.ts');
    expect(html.trim().startsWith('<table>')).toBe(true);
    expect(html.trim().endsWith('</table>')).toBe(true);
  });
});
