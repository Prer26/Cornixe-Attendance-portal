import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PortalLayout } from "@/components/portal/PortalLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { applyLeave } from "@/lib/api";
import type { Employee } from "@/lib/api";

export const Route = createFileRoute("/apply-leave")({
  head: () => ({
    meta: [
      { title: "Apply Leave — Cornixe Employee Portal" },
      {
        name: "description",
        content: "Submit a leave request to the Cornixe management team.",
      },
      {
        property: "og:title",
        content: "Apply Leave — Cornixe Employee Portal",
      },
      {
        property: "og:description",
        content: "Casual, sick and personal leave requests in a few clicks.",
      },
    ],
  }),
  component: ApplyLeavePage,
});

function getEmployee(): Employee | null {
  try {
    const stored = localStorage.getItem("cornixe_employee");

    if (!stored) return null;

    return JSON.parse(stored) as Employee;
  } catch {
    return null;
  }
}

function ApplyLeavePage() {
  const navigate = useNavigate();

  const employee = getEmployee();

  const [leaveType, setLeaveType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");

  const days = useMemo(() => {
    if (!from || !to) return 0;

    const start = new Date(`${from}T00:00:00`);
    const end = new Date(`${to}T00:00:00`);

    const diff = end.getTime() - start.getTime();

    if (Number.isNaN(diff) || diff < 0) return 0;

    return Math.floor(diff / 86400000) + 1;
  }, [from, to]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employee) {
      toast.error("Employee information not found. Please log in again.");
      navigate({ to: "/" });
      return;
    }

    if (!leaveType || !from || !to || days < 1) {
      toast.error("Please choose a leave type and a valid date range.");
      return;
    }

    if (!reason.trim()) {
      toast.error("Please enter a reason for your leave.");
      return;
    }

    setLoading(true);

    const result = await applyLeave({
      employeeId: employee.employeeId,
      employeeName: employee.name,
      email: employee.email,
      leaveType,
      fromDate: from,
      toDate: to,
      reason: reason.trim(),
    });

    setLoading(false);

    if (!result.success) {
      toast.error(result.message || "Unable to submit leave request.");
      return;
    }

    setRequestId(result.requestId || "");

    setSubmitted(true);

    toast.success("Leave request submitted", {
      description:
        "Your request has been sent to the management team for review.",
    });
  };

  if (submitted) {
    return (
      <PortalLayout title="Apply Leave" description="Request time off">
        <div className="card-surface mx-auto max-w-lg p-8 text-center">
          <CheckCircle2 className="text-brand-blue mx-auto h-12 w-12" />

          <h2 className="mt-4 text-lg font-semibold text-foreground">
            Leave request submitted
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Your {leaveType.toLowerCase()} request for {days}{" "}
            {days === 1 ? "day" : "days"} has been sent to the management team
            for review.
          </p>

          {requestId && (
            <p className="mt-3 text-xs font-medium text-muted-foreground">
              Request ID: {requestId}
            </p>
          )}

          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Button
              className="bg-gradient-brand text-white hover:opacity-90"
              onClick={() => navigate({ to: "/my-requests" })}
            >
              View my requests
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setLeaveType("");
                setFrom("");
                setTo("");
                setReason("");
                setRequestId("");
              }}
            >
              Apply for another leave
            </Button>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout title="Apply Leave" description="Request time off">
      <div className="mx-auto grid max-w-3xl gap-6">
        <form
          onSubmit={handleSubmit}
          className="card-surface space-y-5 p-5 sm:p-6"
        >
          <div className="space-y-2">
            <Label htmlFor="type">Leave type</Label>

            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>

              <SelectContent>
                {[
                  "Casual Leave",
                  "Sick Leave",
                  "Personal Leave",
                  "Other",
                ].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="from">From date</Label>

              <Input
                id="from"
                type="date"
                value={from}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFrom(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">To date</Label>

              <Input
                id="to"
                type="date"
                value={to}
                min={from || new Date().toISOString().split("T")[0]}
                onChange={(e) => setTo(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="days">Number of days</Label>

              <Input
                id="days"
                value={days ? String(days) : "—"}
                readOnly
                className="bg-secondary/60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>

            <Textarea
              id="reason"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe the reason for your leave"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-brand h-11 w-full text-base font-semibold text-white hover:opacity-90 sm:w-auto sm:px-8"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit Leave Request"
            )}
          </Button>
        </form>

        <div className="flex gap-3 rounded-xl border border-border bg-accent/50 p-4">
          <Info className="text-brand-blue mt-0.5 h-4 w-4 shrink-0" />

          <p className="text-sm text-muted-foreground">
            Leave requests are reviewed by the Cornixe management team. You
            will be notified once your request is approved or rejected, and
            the status will update under My Requests.
          </p>
        </div>
      </div>
    </PortalLayout>
  );
}