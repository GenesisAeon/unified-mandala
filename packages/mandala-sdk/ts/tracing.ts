import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { Resource } from '@opentelemetry/resources';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SimpleSpanProcessor, BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'mandala-bus',
  }),
});

const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
if (endpoint) {
  provider.addSpanProcessor(
    new BatchSpanProcessor(new OTLPTraceExporter({ url: `${endpoint}/v1/traces` })),
  );
} else {
  class ConsoleExporter {
    export(spans: any, result: any) {
      console.log('otel spans:', spans.length);
      result.success();
    }
    shutdown() {}
  }
  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleExporter() as any));
}
provider.register();
export { provider };
