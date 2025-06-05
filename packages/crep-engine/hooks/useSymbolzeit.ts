import { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

interface Phase {
  start: number;
  end: number;
  phase: string;
  farbe: string;
}

export const useSymbolzeit = () => {
  const [current, setCurrent] = useState<Phase | null>(null);

  useEffect(() => {
    const file = fs.readFileSync(path.join(__dirname, '../data/symbolzeit.yaml'), 'utf8');
    const data: Record<string, Phase> = yaml.parse(file);
    const update = () => {
      const hour = new Date().getHours();
      const key = Object.keys(data).find(k => {
        const p = data[k];
        if (p.start <= p.end) return hour >= p.start && hour <= p.end;
        return hour >= p.start || hour <= p.end;
      }) as keyof typeof data;
      setCurrent(data[key]);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return current;
};
