# Key management

The customer controls package recovery material. The server must never receive plaintext, an unwrapped content-encryption key, a recipient private key, or an offline recovery key. Test mode creates an ephemeral AES-GCM key in the browser and may export a separately passphrase-wrapped local test recovery file. Recipient envelopes and production key formats are disabled until independent review. There is no server key escrow or operator recovery path.
