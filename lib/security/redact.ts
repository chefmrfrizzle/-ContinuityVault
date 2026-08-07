const blockedKeyPattern =
  /(secret|token|password|plaintext|content|recovery|key|authorization|cookie)/i;

export function redactRecord(
  input: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => {
      if (blockedKeyPattern.test(key)) return [key, "[REDACTED]"];
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return [key, redactRecord(value as Record<string, unknown>)];
      }
      return [key, value];
    }),
  );
}
