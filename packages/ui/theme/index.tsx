import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCREPContext } from '../unifiedmandala-ui/contexts/CREPContext';

export type Mood = 'neutral' | 'positive' | 'critical';
export type Style = 'light' | 'dark';

interface ThemeState {
  mood: Mood;
  style: Style;
}

interface ThemeContextValue {
  theme: ThemeState;
  toggleStyle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: { mood: 'neutral', style: 'light' },
  toggleStyle: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useCREPContext();
  const [style, setStyle] = useState<Style>('light');
  const [mood, setMood] = useState<Mood>('neutral');

  useEffect(() => {
    if (state.history.length > 0) {
      const latest = state.history[state.history.length - 1];
      if (latest.E > latest.R) {
        setMood('critical');
      } else {
        setMood('positive');
      }
    }
  }, [state.history]);

  const toggleStyle = () => setStyle(s => (s === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme: { mood, style }, toggleStyle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useResponsiveTheme = () => useContext(ThemeContext);
