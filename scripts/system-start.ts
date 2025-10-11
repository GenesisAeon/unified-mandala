#!/usr/bin/env ts-node
import AgentWorkflowEngine from '../packages/agents/AgentWorkflowEngine';

const dryRun = process.argv.includes('--dry-run');

const engine = new AgentWorkflowEngine();
engine.on('loaded', ({ count }) => console.log(`Loaded ${count} agents`));
engine.on('agent:dry-run', (a) => console.log(`[dry-run] ${a.id}`));
engine.on('agent:start', (a) => console.log(`Starting ${a.id}`));
engine.on('agent:started', (a) => console.log(`Started ${a.id}`));
engine.on('finished', ({ count }) => console.log(`Finished ${count} agents`));

engine.loadAgents();
engine.start(dryRun);
