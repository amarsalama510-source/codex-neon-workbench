import { cn } from "@/lib/utils";

export function C4Mark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "neon-frame inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-surface font-mono text-[11px] font-bold neon-text",
        className,
      )}
      aria-hidden
    >
      C4
    </span>
  );
}

export function Signature({ className }: { className?: string }) {
  return (
    <p className={cn("font-mono text-[11px] tracking-wide text-muted-foreground", className)}>
      Development by <span className="signature-text font-semibold">AMAR SALAMA</span>
    </p>
  );
}
