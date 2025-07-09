import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

export function startFourierObservability(serviceName = 'fourier-metrics') {
  const sdk = new NodeSDK({
    serviceName,
    instrumentations: [getNodeAutoInstrumentations()],
  });
  sdk.start();
  return sdk;
}
