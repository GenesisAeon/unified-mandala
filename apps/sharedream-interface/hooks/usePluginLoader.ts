import { useEffect, useState } from 'react';
import YAML from 'yaml';
import Ajv from 'ajv';
import manifestSchema from '../../../plugins/manifest.schema.json';

export interface PluginDefinition {
  name: string;
  version: string;
  component: string;
  dataHook?: string;
  crepCondition?: string;
  story?: string;
}

export interface LoadedPlugin extends PluginDefinition {
  Component: any;
  useDataHook?: any;
}

export function usePluginLoader() {
  const [plugins, setPlugins] = useState<LoadedPlugin[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/plugins/manifest.yaml')
      .then((res) => res.text())
      .then((text) => YAML.parse(text))
      .then(async (manifest: { plugins: PluginDefinition[] }) => {
        const ajv = new Ajv();
        const validate = ajv.compile(manifestSchema as any);
        if (!validate(manifest)) {
          console.error('Ungültiges Plugin-Manifest:', validate.errors);
          setError('Ungültiges Plugin-Manifest');
          return;
        }
        const loaded = await Promise.all(
          manifest.plugins.map(async (p: PluginDefinition) => {
            const Component = (await import(/* @vite-ignore */ p.component)).default;
            const useDataHook = p.dataHook
              ? (await import(/* @vite-ignore */ p.dataHook)).default
              : undefined;
            return { ...p, Component, useDataHook } as LoadedPlugin;
          }),
        );
        setPlugins(loaded);
      })
      .catch((err) => {
        console.error('Fehler beim Laden der Plugins:', err);
        setError('Fehler beim Laden der Plugins');
      });
  }, []);

  return { plugins, error };
}
