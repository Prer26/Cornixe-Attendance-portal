import logo from "@/assets/cornixe-logo.jpg";
import { cn } from "@/lib/utils";

export function Logo({ className, showTagline = false }: { className?: string; showTagline?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img src={logo} alt="Cornixe" className="h-10 w-auto object-contain" />
      {showTagline ? (
        <span className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Employee Portal
        </span>
      ) : null}
    </div>
  );
}
