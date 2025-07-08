import React, { useEffect, useRef } from 'react';
import { CREPEntry } from '../../crep-engine/types';

interface Props {
  history: CREPEntry[];
}

const CREPVisualizer: React.FC<Props> = ({ history }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = ref.current;
    let x = 0;
    history.forEach((e) => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', String(x));
      rect.setAttribute('y', String(50 - e.C * 5));
      rect.setAttribute('width', '2');
      rect.setAttribute('height', String(e.C * 5));
      rect.setAttribute('fill', '#8884d8');
      svg.appendChild(rect);
      x += 3;
    });
  }, [history]);

  return <svg ref={ref} width={300} height={60} aria-label="CREP Visualizer" />;
};

export default CREPVisualizer;
