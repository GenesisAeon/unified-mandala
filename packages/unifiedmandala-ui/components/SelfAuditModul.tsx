import React from 'react';
import { analyzeRepo } from '../../shared-utils';

const SelfAuditModul: React.FC = () => {
  const stats = analyzeRepo();
  return (
    <section>
      <h3>Self Audit</h3>
      <p>Packages: {stats.packages.length}</p>
      <p>Doc files: {stats.docFiles}</p>
      <p>Test files: {stats.testFiles}</p>
    </section>
  );
};

export default SelfAuditModul;
