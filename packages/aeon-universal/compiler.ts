import fs from "fs";
import path from "path";
import { AeonMemory } from "../core/AeonMemory";
import { AeonSigillinVault } from "../core/AeonSigillinVault";
import { Task } from "../core/interfaces";
import { AeonDiagnostics, Diagnostic } from "./diagnostics";
import { HookManager, ASTNode } from "./hooks";
import { compileCache, hashSource } from './cache';

export interface CompileResult {
  tasks: Task[];
  diagnostics: Diagnostic[];
}

export interface CompileOptions {
  baseDir?: string;
  visited?: Set<string>;
  macros?: Record<string, { params: string[]; lines: string[] }>;
  currentMacro?: string | null;
  contextStack?: string[];
  repeatStack?: { count: number; buffer: string[] }[];
  routeStack?: string[];
  hookManager?: HookManager;
  diagnostics?: AeonDiagnostics;
  disableCache?: boolean;
}

export function compile(
  source: string,
  options: CompileOptions = {},
): CompileResult {
  AeonMemory.load();
  const hash = hashSource(source);
  if (!options.disableCache) {
    const cached = compileCache.get(hash);
    if (cached) {
      return cached;
    }
  }
  const tasks: Task[] = [];
  const baseDir = options.baseDir || process.cwd();
  const visited = options.visited || new Set<string>();
  const macros = options.macros || {};
  let currentMacro = options.currentMacro || null;
  let contextStack = options.contextStack || [];
  let repeatStack = options.repeatStack || [];
  let routeStack = options.routeStack || [];
  const hookManager = options.hookManager;
  const diagnostics = options.diagnostics || new AeonDiagnostics();

  hookManager?.invoke('beforeCompile', { ast: { type: 'Script' }, diagnostics });

  const lines = source.split(/\n+/);
  lines.forEach((line, idx) => {
    try {
    const trimmed = line.trim();
    if (!trimmed) return;
    const [cmd, ...rest] = trimmed.split(" ");
    const content = rest.join(" ");

    // handle repeat blocks
    if (repeatStack.length > 0) {
      const current = repeatStack[repeatStack.length - 1];
      if (cmd.toUpperCase() === "ENDREPEAT") {
        repeatStack.pop();
        for (let i = 0; i < current.count; i++) {
          const child = compile(current.buffer.join("\n"), {
            baseDir,
            visited,
            macros,
            contextStack,
            repeatStack,
            routeStack,
            hookManager,
            diagnostics,
          });
          tasks.push(...child.tasks);
        }
      } else {
        current.buffer.push(trimmed);
      }
      return;
    }

    // handle macro definition blocks
    if (currentMacro) {
      if (cmd.toUpperCase() === "END") {
        currentMacro = null;
      } else {
        macros[currentMacro].lines.push(trimmed);
      }
      return;
    }

    if (cmd.toUpperCase() === "DEFINE") {
      const [name, ...params] = rest;
      currentMacro = name;
      macros[currentMacro] = { params, lines: [] };
    } else if (cmd.toUpperCase() === "CALL") {
      const [name, ...args] = rest;
      const macro = macros[name];
      if (macro) {
        const map: Record<string, string> = {};
        macro.params.forEach((p, i) => {
          map[p] = args[i] || "";
        });
        const expanded = macro.lines.map((l) =>
          l.replace(/\$(\w+)/g, (_, p) => map[p] ?? ""),
        );
        const child = compile(expanded.join("\n"), {
          baseDir,
          visited,
          macros,
          contextStack,
          routeStack,
          hookManager,
          diagnostics,
        });
        tasks.push(...child.tasks);
      }
    } else if (cmd.toUpperCase() === "REM") {
      AeonMemory.record(content);
    } else if (/^emitsigil/i.test(cmd)) {
      const match = trimmed.match(/^emitsigil\("([^"\\]+)",\s*"([^"\\]+)"(?:,\s*(.*))?\);?$/i);
      if (match) {
        const name = match[1];
        const category = match[2];
        const paramStr = match[3];
        const params: Record<string, string | number> = {};
        if (paramStr) {
          paramStr.split(/,\s*/).forEach(p => {
            const [k, v] = p.split(":").map(s => s.trim());
            if (k && v !== undefined) {
              const num = parseFloat(v.replace(/^"|"$/g, ""));
              params[k] = isNaN(num) ? v.replace(/^"|"$/g, "") : num;
            }
          });
        }
        AeonSigillinVault.record({
          id: `${idx}`,
          timestamp: new Date().toISOString(),
          content: name,
          category,
          params,
        });
        hookManager?.invoke('afterEmitSigil', {
          ast: { type: 'EmitSigil', name, category, params } as ASTNode,
          diagnostics,
        });
      } else {
        diagnostics.report({
          line: idx + 1,
          column: 1,
          message: 'Invalid emitSigil syntax',
          code: 'EMITSIGIL_SYNTAX',
          severity: 'error',
        });
      }
    } else if (
      cmd.toUpperCase() === "SIG" ||
      cmd.toUpperCase() === "SIGILLIN"
    ) {
      AeonSigillinVault.record({
        id: `${idx}`,
        timestamp: new Date().toISOString(),
        content,
      });
      hookManager?.invoke('afterEmitSigil', {
        ast: { type: 'EmitSigil', value: content } as ASTNode,
        diagnostics,
      });
    } else if (cmd.toUpperCase() === "GUARD") {
      AeonSigillinVault.recordGuard({
        id: `${idx}`,
        timestamp: new Date().toISOString(),
        content,
      });
    } else if (cmd.toUpperCase() === "WITH") {
      contextStack = [...contextStack, content];
    } else if (cmd.toUpperCase() === "ENDWITH") {
      contextStack.pop();
    } else if (cmd.toUpperCase() === "REPEAT") {
      const count = parseInt(content, 10);
      if (!isNaN(count)) {
        repeatStack.push({ count, buffer: [] });
      }
    } else if (cmd.toUpperCase() === "ROUTE") {
      routeStack.push(content);
    } else if (cmd.toUpperCase() === "ENDROUTE") {
      routeStack.pop();
    } else if (cmd.toUpperCase() === "TASK") {
      tasks.push({
        id: `${idx}`,
        description: content,
        context: contextStack.join("/"),
        route: routeStack[routeStack.length - 1],
      });
    } else if (cmd.toUpperCase() === "INCLUDE") {
      const filePath = path.resolve(baseDir, content);
      if (!visited.has(filePath) && fs.existsSync(filePath)) {
        visited.add(filePath);
        const childSource = fs.readFileSync(filePath, "utf-8");
        const child = compile(childSource, {
          baseDir: path.dirname(filePath),
          visited,
          macros,
          contextStack,
          routeStack,
          hookManager,
          diagnostics,
        });
        tasks.push(...child.tasks);
      }
    } else {
      diagnostics.report({
        line: idx + 1,
        column: 1,
        message: `Unknown command: ${cmd}`,
        code: "UNKNOWN_CMD",
        severity: "warning",
      });
    }
  } catch (err) {
    diagnostics.report({
      line: idx + 1,
      column: 1,
      message: (err as Error).message,
      code: 'COMPILE_ERROR',
      severity: 'error',
    });
    hookManager?.invoke('onError', {
      ast: { type: 'Error', error: err } as ASTNode,
      diagnostics,
    });
  }
  });

  const result = { tasks, diagnostics: diagnostics.getAll() };
  if (!options.disableCache) {
    compileCache.set(hash, result);
  }
  return result;
}

export function transpileToTS(result: CompileResult): string {
  const data = result.tasks.map((t) => ({
    id: t.id,
    description: t.description,
    context: t.context,
    route: t.route,
  }));
  return `export const aeonTasks = ${JSON.stringify(data, null, 2)};\n`;
}

export function transpileToPython(result: CompileResult): string {
  const data = result.tasks.map((t) => ({
    id: t.id,
    description: t.description,
    context: t.context,
    route: t.route,
  }));
  return `aeon_tasks = ${JSON.stringify(data, null, 2)}\n`;
}

export function transpileToGo(result: CompileResult): string {
  const lines = [
    "package aeon",
    "",
    "type Task struct {",
    "  ID string",
    "  Description string",
    "  Context string",
    "  Route string",
    "}",
    "",
    "var AeonTasks = []Task{",
  ];
  result.tasks.forEach((t) => {
    lines.push(
      `  {ID: "${t.id}", Description: "${t.description}", Context: "${t.context}", Route: "${t.route}"},`,
    );
  });
  lines.push("}");
  return lines.join("\n") + "\n";
}

export function transpileToRust(result: CompileResult): string {
  const lines = [
    "pub struct Task {",
    "    pub id: &'static str,",
    "    pub description: &'static str,",
    "    pub context: &'static str,",
    "    pub route: &'static str,",
    "}",
    "",
    "pub static AEON_TASKS: &[Task] = &[",
  ];
  result.tasks.forEach((t) => {
    lines.push(
      `    Task { id: \"${t.id}\", description: \"${t.description}\", context: \"${t.context}\", route: \"${t.route ?? ''}\" },`,
    );
  });
  lines.push("];");
  return lines.join("\n") + "\n";
}

export function transpileToJS(result: CompileResult): string {
  const data = result.tasks.map((t) => ({
    id: t.id,
    description: t.description,
    context: t.context,
    route: t.route,
  }));
  return `export const aeonTasks = ${JSON.stringify(data, null, 2)};\n`;
}
