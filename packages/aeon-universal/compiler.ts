import fs from "fs";
import path from "path";
import { AeonMemory } from "../core/AeonMemory";
import { AeonSigillinVault } from "../core/AeonSigillinVault";
import { Task } from "../core/interfaces";

export interface CompileResult {
  tasks: Task[];
}

export interface CompileOptions {
  baseDir?: string;
  visited?: Set<string>;
  macros?: Record<string, { params: string[]; lines: string[] }>;
  currentMacro?: string | null;
  contextStack?: string[];
  repeatStack?: { count: number; buffer: string[] }[];
}

export function compile(
  source: string,
  options: CompileOptions = {},
): CompileResult {
  AeonMemory.load();
  const tasks: Task[] = [];
  const baseDir = options.baseDir || process.cwd();
  const visited = options.visited || new Set<string>();
  const macros = options.macros || {};
  let currentMacro = options.currentMacro || null;
  let contextStack = options.contextStack || [];
  let repeatStack = options.repeatStack || [];

  const lines = source.split(/\n+/);
  lines.forEach((line, idx) => {
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
        });
        tasks.push(...child.tasks);
      }
    } else if (cmd.toUpperCase() === "REM") {
      AeonMemory.record(content);
    } else if (
      cmd.toUpperCase() === "SIG" ||
      cmd.toUpperCase() === "SIGILLIN"
    ) {
      AeonSigillinVault.record({
        id: `${idx}`,
        timestamp: new Date().toISOString(),
        content,
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
    } else if (cmd.toUpperCase() === "TASK") {
      tasks.push({
        id: `${idx}`,
        description: content,
        context: contextStack.join("/"),
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
        });
        tasks.push(...child.tasks);
      }
    }
  });

  return { tasks };
}

export function transpileToTS(result: CompileResult): string {
  const data = result.tasks.map((t) => ({
    id: t.id,
    description: t.description,
    context: t.context,
  }));
  return `export const aeonTasks = ${JSON.stringify(data, null, 2)};\n`;
}

export function transpileToPython(result: CompileResult): string {
  const data = result.tasks.map((t) => ({
    id: t.id,
    description: t.description,
    context: t.context,
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
    "}",
    "",
    "var AeonTasks = []Task{",
  ];
  result.tasks.forEach((t) => {
    lines.push(
      `  {ID: "${t.id}", Description: "${t.description}", Context: "${t.context}"},`,
    );
  });
  lines.push("}");
  return lines.join("\n") + "\n";
}
