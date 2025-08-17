import { RunLogger } from '../packages/shared-utils/runLogger';

// Demo script showing how to emit and read run logs
const logFile = 'runlog-demo.jsonl';
const logger = new RunLogger(logFile);

logger.log('start', { message: 'demo run started' });
for (let i = 0; i < 3; i++) {
  logger.log('step', { step: i });
}
logger.log('end');

const entries = RunLogger.read(logFile);
console.log('Run entries:', entries.filter(e => e.run_id === logger.id));
