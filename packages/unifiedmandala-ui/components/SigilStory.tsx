import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export interface Milestone {
  sigil: string;
  hint: string;
  time: number;
}

export interface SigilPath {
  name: string;
  milestones: Milestone[];
}

export interface SigilStoryProps {
  paths: SigilPath[];
}

const radius = 80;

const SigilStory: React.FC<SigilStoryProps> = ({ paths }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    paths.forEach((path, idx) => {
      const g = svg
        .append('g')
        .attr('transform', `translate(${radius * 2}, ${(idx + 1) * radius * 2})`);
      const maxTime = d3.max(path.milestones, (m) => m.time) || 1;
      const angle = d3
        .scaleLinear()
        .domain([0, maxTime])
        .range([0, 2 * Math.PI]);

      const arcGen = d3
        .arc<d3.DefaultArcObject>()
        .innerRadius(radius - 20)
        .outerRadius(radius);

      g.selectAll('path')
        .data(path.milestones)
        .enter()
        .append('path')
        .attr(
          'd',
          (d) =>
            arcGen({
              startAngle: angle(d.time),
              endAngle: angle(d.time) + 0.3,
              innerRadius: radius - 20,
              outerRadius: radius,
            })!,
        )
        .attr('fill', '#6b6')
        .append('title')
        .text((d) => `${d.sigil}: ${d.hint}`);
    });
  }, [paths]);

  return (
    <svg ref={ref} aria-label="Sigil Story" width={400} height={paths.length * radius * 2.5} />
  );
};

export default SigilStory;
