import tls, { type TLSSocket } from 'node:tls';
import { normalizeIp } from './ipRanges.js';

export type TlsPreflightResult = {
  remoteAddress: string | undefined;
  sanOk: boolean;
};

export async function tlsPreflight(
  hostname: string,
  ip: string,
  port = 443,
  timeoutMs = Number.parseInt(process.env.VERIFY_GATE_TLS_PREFLIGHT_TIMEOUT_MS ?? '5000', 10),
): Promise<TlsPreflightResult> {
  return await new Promise<TlsPreflightResult>((resolve, reject) => {
    const socket = tls.connect({
      host: ip,
      port,
      servername: hostname,
      rejectUnauthorized: true,
      timeout: timeoutMs,
      checkServerIdentity(serverHost, cert) {
        const err = tls.checkServerIdentity(serverHost, cert);
        return err ?? undefined;
      },
    });

    socket.once('secureConnect', function onSecure(this: TLSSocket) {
      const sanOk = this.authorized === true;
      const remoteRaw = typeof this.remoteAddress === 'string' ? this.remoteAddress : undefined;
      const remoteAddress = remoteRaw ? normalizeIp(remoteRaw) : undefined;
      this.end();
      this.destroy();
      resolve({ remoteAddress, sanOk });
    });

    socket.once('error', (error) => {
      socket.destroy();
      reject(error);
    });

    socket.setTimeout(timeoutMs, () => {
      socket.destroy(new Error('TLS_PREFLIGHT_TIMEOUT'));
    });
  });
}
