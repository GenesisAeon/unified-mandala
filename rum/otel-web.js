// Lightweight OpenTelemetry Web snippet for browser RUM
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

const collectorUrl = window.__OTEL_COLLECTOR_URL__ || 'http://localhost:4318/v1/traces';

const provider = new WebTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter({ url: collectorUrl })));
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.register();

registerInstrumentations({
  instrumentations: [new DocumentLoadInstrumentation()],
});

console.log('OTel web tracer initialized', collectorUrl);
