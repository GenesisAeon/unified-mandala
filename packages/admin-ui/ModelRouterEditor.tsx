import React, { useState } from 'react';

export interface Route {
  model: string;
  target: string;
}

export interface ModelRouterEditorProps {
  initialRoutes?: Route[];
  onChange?: (routes: Route[]) => void;
}

/**
 * ModelRouterEditor allows editing of simple model routing rules.
 * Routes can be added dynamically and emit changes via the onChange callback.
 */
const ModelRouterEditor: React.FC<ModelRouterEditorProps> = ({ initialRoutes = [], onChange }) => {
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);

  const updateRoute = (index: number, key: keyof Route, value: string) => {
    const next = routes.slice();
    next[index] = { ...next[index], [key]: value };
    setRoutes(next);
    onChange?.(next);
  };

  const addRoute = () => {
    const next = [...routes, { model: '', target: '' }];
    setRoutes(next);
    onChange?.(next);
  };

  return (
    <div>
      <h2>Model Router Editor</h2>
      {routes.map((r, i) => (
        <div key={i}>
          <input
            placeholder="Model"
            value={r.model}
            onChange={(e) => updateRoute(i, 'model', e.target.value)}
          />
          <input
            placeholder="Target"
            value={r.target}
            onChange={(e) => updateRoute(i, 'target', e.target.value)}
          />
        </div>
      ))}
      <button onClick={addRoute}>Add Route</button>
    </div>
  );
};

export default ModelRouterEditor;
