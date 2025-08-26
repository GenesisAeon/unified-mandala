export interface PeerAttestation {
  /** Signature over the handshake payload */
  signature: string;
  /** Optional public key for verification */
  publicKey?: string;
}

export interface PeerHello {
  /** Identifier for the sending peer */
  peerId: string;
  /** ISO timestamp for when the hello was created */
  timestamp: string;
  /** Declared capabilities */
  capabilities?: string[];
  /** Attestation data proving authenticity */
  attestation: PeerAttestation;
}
