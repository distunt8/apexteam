import { cn } from "@/lib/cn";

export function Wordmark({ className }: { className?: string }) {
  return (
    <img
      src="/brand/logo.png"
      alt="Апекс"
      className={cn("h-10 w-auto", className)}
    />
  );
}
