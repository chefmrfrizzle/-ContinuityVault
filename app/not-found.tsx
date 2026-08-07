import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--cv-paper)] p-5">
      <div>
        <p className="font-mono text-xs uppercase tracking-[.16em]">
          404 · route not found
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-.05em]">
          This path is not part of the plan.
        </h1>
        <Button href="/" className="mt-7">
          Return home
        </Button>
      </div>
    </main>
  );
}
