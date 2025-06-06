#!/usr/bin/env node
const { analyzeRepo, printRepoStats } = require('../packages/shared-utils/selfAnalyzer');
const stats = analyzeRepo();
printRepoStats(stats);
