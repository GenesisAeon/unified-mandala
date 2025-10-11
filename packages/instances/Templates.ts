import path from 'path';

export interface UITemplate {
  /**
   * Unique identifier of the template.
   */
  id: string;
  /**
   * Absolute path to the template source directory.
   */
  source: string;
  /**
   * Optional human readable description.
   */
  description?: string;
}

/**
 * Available UI templates that can be cloned by the instance registry.
 *
 * Templates currently point to existing packages inside the repository.
 */
export const templates: Record<string, UITemplate> = {
  adminConsole: {
    id: 'adminConsole',
    source: path.resolve(__dirname, '..', 'admin-ui'),
    description: 'Admin console UI template',
  },
  commonsHub: {
    id: 'commonsHub',
    source: path.resolve(__dirname, '..', 'commons-ui'),
    description: 'Commons hub UI template',
  },
};

export type TemplateName = keyof typeof templates;

export function getTemplate(name: TemplateName): UITemplate {
  return templates[name];
}
