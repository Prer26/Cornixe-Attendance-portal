import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PortalLayout } from "@/components/portal/PortalLayout";
import { DataTable, type Column } from "@/components/portal/DataTable";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { getLeaves, type LeaveRecord } from "@/lib/api";

export const Route = createFileRoute("/my-requests")({
  head: () => ({
    meta: [
      { title: "My Leave Requests — Cornixe Employee Portal" },
      {
        name: "description",
        content: "Track the status of your Cornixe leave requests.",
      },
      {
        property: "og:title",
        content: "My Leave Requests — Cornixe Employee Portal",
      },
      {
        property: "og:description",
        content:
          "Pending, approved and rejected leave requests in one place.",
      },
    ],
  }),
  component: MyRequestsPage,
});

const columns: Column<LeaveRecord>[] = [
  {
    key: "Request ID",
    header: "Request ID",
    render: (r) => (
      <span className="font-medium">{r["Request ID"]}</span>
    ),
  },
  {
    key: "Leave Type",
    header: "Leave Type",
    render: (r) => r["Leave Type"],
  },
  {
    key: "From Date",
    header: "From",
    render: (r) => r["From Date"],
  },
  {
    key: "To Date",
    header: "To",
    render: (r) => r["To Date"],
  },
  {
    key: "Days",
    header: "Days",
    render: (r) => r.Days,
  },
  {
    key: "Reason",
    header: "Reason",
    className: "max-w-[220px]",
    render: (r) => (
      <span className="block truncate text-muted-foreground">
        {r.Reason}
      </span>
    ),
  },
  {
    key: "Status",
    header: "Status",
    render: (r) => <StatusBadge status={r.Status} />,
  },
  {
    key: "Applied On",
    header: "Applied On",
    render: (r) => r["Applied On"],
  },
];

function getEmployeeEmail() {
  try {
    const stored = localStorage.getItem("cornixe_employee");

    if (!stored) return "";

    const employee = JSON.parse(stored);

    return employee.email || "";
  } catch {
    return "";
  }
}

function MyRequestsPage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLeaves();
  }, []);

  async function loadLeaves() {
    const email = getEmployeeEmail();

    if (!email) {
      setError("Employee information not found.");
      setLoading(false);
      return;
    }

    const result = await getLeaves(email);

    if (result.success) {
      setLeaveRequests(result.leaves || []);
    } else {
      setError(result.message || "Unable to load leave requests.");
    }

    setLoading(false);
  }

  const pending = leaveRequests.filter(
    (request) => request.Status === "Pending",
  ).length;

  return (
    <PortalLayout
      title="My Requests"
      description="History of your leave applications"
    >
      <div className="space-y-5">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          {loading
            ? "Loading your leave requests..."
            : `${leaveRequests.length} requests in total · ${pending} awaiting review`}
        </p>

        <DataTable
          columns={columns}
          rows={leaveRequests}
          emptyTitle={
            loading ? "Loading leave requests..." : "No leave requests yet"
          }
          emptyDescription={
            loading
              ? "Fetching your requests from Google Sheets."
              : "Once you apply for leave, every request will be listed here with its status."
          }
        />
      </div>
    </PortalLayout>
  );
}