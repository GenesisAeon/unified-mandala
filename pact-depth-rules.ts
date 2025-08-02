export type Role = 'admin' | 'developer' | 'guest';

export interface GatekeeperOptions {
  /** Mindesttiefe, die erforderlich ist, um Zugriff zu erhalten. */
  minLnSum?: number;
  /** Liste der Rollen, die Zugriff erhalten. */
  allowedRoles?: Role[];
}

const defaultOptions: Required<GatekeeperOptions> = {
  minLnSum: 16,
  allowedRoles: ['admin'],
};

/**
 * Prüft, ob für die angegebene Tiefe und Rolle Zugriff gewährt wird.
 */
export function hasAccess(depth: number, role: Role, options: GatekeeperOptions = {}): boolean {
  const { minLnSum, allowedRoles } = { ...defaultOptions, ...options };
  if (depth < minLnSum) return false;
  return allowedRoles.includes(role);
}

/**
 * Ermittelt eine textuelle Antwort auf Basis der Zugriffsentscheidung.
 */
export function gatekeep(depth: number, role: Role, options: GatekeeperOptions = {}): string {
  return hasAccess(depth, role, options)
    ? 'Zugriff gewährt'
    : 'Zugriff verweigert';
}
