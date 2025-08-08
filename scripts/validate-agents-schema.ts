#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

export interface AgentValidationResult {
  agentCount: number;
  missingStart: string[];
  missingRoles: string[];
  missingDocs: string[];
}

export function validateAgentsSchema(filePath: string): AgentValidationResult {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  const sections: { name: string; type: string; lines: string[] }[] = [];
  let current: { name: string; type: string; lines: string[] } | null = null;

  for (const line of lines) {
    const match = line.match(/^##.*?(ExportAgent|Agent): (.+)$/);
    if (match) {
      if (current) sections.push(current);
      current = { name: match[2].trim(), type: match[1], lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);

  const missingStart: string[] = [];
  const missingRoles: string[] = [];
  const missingDocs: string[] = [];

  const startRegex = /- \*\*(Startmodul|Startmodule|Startinput|Start)\*\*:/i;
  const rolesRegex = /roles_allowed\s*:/i;
  const docsRegex = /Dokumentation\s*:/i;

  for (const sec of sections) {
    const content = sec.lines.join('\n');
    if (sec.type !== 'ExportAgent' && !startRegex.test(content)) missingStart.push(sec.name);
    if (!rolesRegex.test(content)) missingRoles.push(sec.name);
    if (!docsRegex.test(content)) missingDocs.push(sec.name);
  }

  return {
    agentCount: sections.length,
    missingStart,
    missingRoles,
    missingDocs,
  };
}

if (require.main === module) {
  const target = process.argv[2] || path.join(__dirname, '..', 'AGENTS.md');
  const res = validateAgentsSchema(target);
  if (res.missingStart.length || res.missingRoles.length || res.missingDocs.length) {
    if (res.missingStart.length)
      console.error('Agents missing start module/input:', res.missingStart);
    if (res.missingRoles.length)
      console.error('Agents missing roles_allowed:', res.missingRoles);
    if (res.missingDocs.length)
      console.error('Agents missing documentation:', res.missingDocs);
    process.exit(1);
  }
  console.log(`Validated ${res.agentCount} agents successfully.`);
}
