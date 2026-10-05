import { Clock, LogIn, LogOut, Timer } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import type { AttendanceRecord } from "@/lib/api";

type AttendanceCardProps = {
  isLoggedIn: boolean;
  loading: boolean;
  onAttendance: () => void;
  todayAttendance?: AttendanceRecord;
};

function getWorkingHours(record?: AttendanceRecord) {
  if (!record) return "0h 00m";

  return record["Total Hours"] || "0h 00m";
}

export function AttendanceCard({
  isLoggedIn,
  loading,
  onAttendance,
  todayAttendance,
}: AttendanceCardProps) {
  const loginTime = todayAttendance?.["Login Time"] || null;
  const logoutTime = todayAttendance?.["Logout Time"] || null;

  const handleToggle = () => {
    onAttendance();

    if (isLoggedIn) {
      toast.info("Logging out...", {
        description: "Recording your working hours for today.",
      });
    } else {
      toast.info("Logging in...", {
        description: "Recording your attendance for today.",
      });
    }
  };

  const status = isLoggedIn
    ? "Logged In"
    : logoutTime
      ? "Logged Out"
      : "Not Checked In";

  return (
    <section className="card-surface flex h-full flex-col justify-center p-5 sm:p-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            Today's attendance
          </p>

          <h2 className="mt-1 truncate text-lg font-semibold text-foreground">
            {isLoggedIn
              ? "You are checked in"
              : logoutTime
                ? "Day completed"
                : "Not checked in yet"}
          </h2>
        </div>

        <StatusBadge status={status} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          icon={LogIn}
          label="Login time"
          value={loginTime ?? "—"}
        />

        <Stat
          icon={LogOut}
          label="Logout time"
          value={logoutTime ?? "—"}
        />

        <Stat
          icon={Timer}
          label="Working hours"
          value={getWorkingHours(todayAttendance)}
        />
      </div>

      <Button
        onClick={handleToggle}
        disabled={loading}
        className="bg-gradient-brand mt-6 h-12 w-full text-base font-semibold text-white shadow-[var(--shadow-raised)] transition-opacity hover:opacity-90"
      >
        {loading ? (
          <>
            <Clock className="animate-spin" />
            Please wait…
          </>
        ) : isLoggedIn ? (
          <>
            <LogOut />
            Log out for today
          </>
        ) : (
          <>
            <LogIn />
            Log in for today
          </>
        )}
      </Button>
    </section>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof LogIn;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/50 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />

        <span className="text-xs font-medium tracking-wide uppercase">
          {label}
        </span>
      </div>

      <p className="mt-2 text-lg font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}