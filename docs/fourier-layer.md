# FourierLayer

The FourierLayer analyzes numeric data for periodic patterns using a basic discrete Fourier transform. It emits metrics that can be visualized by other services.

## Features

- Calculates max and average amplitude of frequency components.
- Emits a `metrics` event via `FourierLayerEvents` when analysis completes.
- Provides `metricsToSVG` helper to create a simple bar representation.

```ts
import { FourierLayer } from '../packages/analysis/FourierLayer';
const layer = new FourierLayer('L1', 1, [1, 0, 1, 0], { depth: 2 });
const metrics = layer.analyze();
```

Metrics can be consumed by [services/fourier-metrics](../services/fourier-metrics/index.ts) to broadcast via WebSocket.
