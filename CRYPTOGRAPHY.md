# Cryptography status

The current AES-256-GCM Web Crypto implementation is provisional, test-only, and limited to harmless synthetic data. It creates a fresh random content key and IV, binds versioned AAD, hashes ciphertext, and can wrap a locally exported test key with PBKDF2-derived AES-GCM. This is not a reviewed production protocol. Production requires algorithm-suite selection, recipient envelope design, nonce analysis, memory-handling review, format migration, test vectors, and independent cryptographic approval.
