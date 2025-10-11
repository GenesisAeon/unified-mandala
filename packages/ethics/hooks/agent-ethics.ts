import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

const DEFAULT_SIMPLE = [
  'impersonation of doctor',
  'ransom',
  'credential harvest',
  'persistenter zugriff',
  'waffe bauen',
];

function tryRead(p: string): string | null {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

function cmpOp(val: any, expr: string): boolean {
  // expr wie "<= -30" oder "== foo"
  const m = expr.match(/^\s*(<=|>=|==|<|>)\s*(.+)\s*$/);
  if (!m) return String(val) === expr;
  const op = m[1];
  const rhsRaw = m[2];
  const rhs = isNaN(Number(rhsRaw)) ? rhsRaw : Number(rhsRaw);
  const lhs = isNaN(Number(val)) ? val : Number(val);
  switch (op) {
    case '<=':
      return (lhs as any) <= (rhs as any);
    case '>=':
      return (lhs as any) >= (rhs as any);
    case '<':
      return (lhs as any) < (rhs as any);
    case '>':
      return (lhs as any) > (rhs as any);
    case '==':
      return lhs === rhs;
    default:
      return false;
  }
}

function deepMatch(obj: any, pat: any): boolean {
  if (!pat || typeof pat !== 'object') return true;
  for (const k of Object.keys(pat)) {
    const pv = (pat as any)[k];
    const ov = obj ? (obj as any)[k] : undefined;
    if (pv && typeof pv === 'object' && !Array.isArray(pv)) {
      if (!deepMatch(ov, pv)) return false;
    } else {
      if (typeof pv === 'string' && /^(<=|>=|==|<|>)\s*/.test(pv)) {
        if (!cmpOp(ov, pv)) return false;
      } else {
        if (ov !== pv) return false;
      }
    }
  }
  return true;
}

export type EthicsVerdict = 'allow' | 'block' | 'review';

export function loadPolicy(): { simple: string[]; rules: any[] } {
  const y1 = tryRead(path.resolve('AI_POLICY.yaml'));
  if (y1) {
    try {
      const doc: any = yaml.parse(y1);
      return {
        simple: Array.isArray(doc?.simple) ? doc.simple : DEFAULT_SIMPLE,
        rules: Array.isArray(doc?.rules) ? doc.rules : [],
      };
    } catch {}
  }
  const md = tryRead(path.resolve('AI_POLICY.md'));
  const simple = md
    ? md
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((l) => !l.startsWith('#'))
    : DEFAULT_SIMPLE;
  return { simple, rules: [] };
}

export function checkEthics(
  action: string,
  intent?: string,
  context: Record<string, unknown> = {},
): EthicsVerdict {
  const pol = loadPolicy();
  const a = action.toLowerCase();
  // 1) Simple Substrings → block
  if (pol.simple.some((s) => a.includes(String(s).toLowerCase()))) return 'block';
  // 2) Kontextregeln
  for (const r of pol.rules) {
    const cond = r?.if || {};
    const out: EthicsVerdict = r?.then || 'review';
    const condIntent = cond.intent ? String(cond.intent) : undefined;
    const condCtx = cond.context || {};
    const intentOk = condIntent ? String(intent || '') === condIntent : true;
    const ctxOk = deepMatch(context, condCtx);
    if (intentOk && ctxOk) return out;
  }
  return 'allow';
}
