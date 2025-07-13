import React from 'react';
import { SigilProvider } from '../../../packages/unifiedmandala-ui';
import SigilCrudPanel from '../../../packages/unifiedmandala-ui/components/SigilCrudPanel';
import ThreeDPyramid from '../../../packages/unifiedmandala-ui/components/ThreeDPyramid';

const Home: React.FC = () => (
  <SigilProvider>
    <div>
      <h1>Pyramid UI Prototype</h1>
      <SigilCrudPanel manager={new (require('../../../packages/shared-utils/SigilManager').SigilManager)()} />
      <ThreeDPyramid layers={3} />
    </div>
  </SigilProvider>
);

export default Home;
