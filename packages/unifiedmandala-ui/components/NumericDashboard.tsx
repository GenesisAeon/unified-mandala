import React from 'react';

export interface NumericData {
  label: string;
  value: number;
}

interface Props {
  data: NumericData[];
}

const NumericDashboard: React.FC<Props> = ({ data }) => {
  return (
    <div>
      <table aria-label="Numeric Table">
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <td>{d.label}</td>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <svg width={data.length * 20} height={100} aria-label="Numeric Histogram">
        {data.map((d, i) => (
          <rect
            key={i}
            x={i * 20}
            y={100 - d.value * 10}
            width={15}
            height={d.value * 10}
            fill="#8884d8"
          />
        ))}
      </svg>
    </div>
  );
};

export default NumericDashboard;
