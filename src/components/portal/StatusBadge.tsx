import { cn } from "@/lib/utils";

type Tone = "success" | "pending" | "danger" | "info" | "neutral";

const toneMap: Record<string, Tone> = {
  Approved: "success",
  Present: "success",
  "Logged In": "success",
  Pending: "pending",
  "Half Day": "pending",
  Rejected: "danger",
  Leave: "info",
  "Logged Out": "neutral",
};

const toneStyles: Record<Tone, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  danger: "bg-rose-50 text-rose-700 ring-rose-200",
  info: "bg-sky-50 text-sky-700 ring-sky-200",
  neutral: "bg-secondary text-secondary-foreground ring-border",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = toneMap[status] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        toneStyles[tone],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
