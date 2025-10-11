import { isOn } from '../../config/featureFlags';

export default function EmergenceExplorer() {
  if (!isOn('emergenceExplorer')) return null;
  return (
    <section className="p-4 border rounded-xl">
      <h3 className="font-semibold mb-2">Emergence Explorer (beta)</h3>
      <p className="text-sm opacity-80">Drag & connect incoming soon…</p>
    </section>
  );
}
