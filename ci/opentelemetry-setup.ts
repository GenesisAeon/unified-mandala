import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

export function initTelemetry() {
  const sdk = new NodeSDK({ instrumentations: [getNodeAutoInstrumentations()] });
  sdk.start();
  return sdk;
}
