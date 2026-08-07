export function isGlobalReleaseFrozen(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return env.GLOBAL_RELEASE_FREEZE_DEFAULT?.toLowerCase() !== "false";
}
