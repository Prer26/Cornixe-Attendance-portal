import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { PortalLayout } from "@/components/portal/PortalLayout";
import { AttendanceCard } from "@/components/portal/AttendanceCard";
import {
  DataTable,
  type Column,
} from "@/components/portal/DataTable";
import { StatusBadge } from "@/components/portal/StatusBadge";

import {
  attendanceLogin,
  attendanceLogout,
  getAttendance,
  getLeaves,
  type AttendanceRecord,
  type Employee,
} from "@/lib/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      {
        title: "Dashboard — Cornixe Employee Portal",
      },
      {
        name: "description",
        content:
          "Check in, track working hours and review recent attendance.",
      },
      {
        property: "og:title",
        content: "Dashboard — Cornixe Employee Portal",
      },
      {
        property: "og:description",
        content:
          "Daily attendance and working hours for Cornixe employees.",
      },
    ],
  }),
  component: DashboardPage,
});

/* =========================================================
   ATTENDANCE TABLE TYPE
========================================================= */

type AttendanceRow = {
  date: string;
  loginTime: string;
  logoutTime: string;
  totalHours: string;
  status: string;
};

/* =========================================================
   LEAVE REQUEST TYPE
========================================================= */

type LeaveRequest = {
  "Request ID"?: string;
  "Employee ID"?: string;
  "Employee Name"?: string;
  Email?: string;
  "Leave Type"?: string;
  "From Date"?: string;
  "To Date"?: string;
  Days?: string | number;
  Reason?: string;
  "Applied On"?: string;
  Status?: string;
  "Reviewed On"?: string;
};

/* =========================================================
   ATTENDANCE TABLE COLUMNS
========================================================= */

const columns: Column<AttendanceRow>[] = [
  {
    key: "date",
    header: "Date",
    render: (r) => (
      <span className="font-medium">
        {r.date || "—"}
      </span>
    ),
  },
  {
    key: "loginTime",
    header: "Login Time",
    render: (r) => r.loginTime || "—",
  },
  {
    key: "logoutTime",
    header: "Logout Time",
    render: (r) => r.logoutTime || "—",
  },
  {
    key: "totalHours",
    header: "Total Hours",
    render: (r) => r.totalHours || "—",
  },
  {
    key: "status",
    header: "Status",
    render: (r) => (
      <StatusBadge
        status={r.status || "Present"}
      />
    ),
  },
];

/* =========================================================
   GREETING
========================================================= */

function greeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  }

  if (hour < 17) {
    return "Good Afternoon";
  }

  return "Good Evening";
}

/* =========================================================
   GET LOGGED-IN EMPLOYEE
========================================================= */

function getEmployee(): Employee | null {
  try {
    const stored =
      localStorage.getItem("cornixe_employee");

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as Employee;
  } catch {
    return null;
  }
}

/* =========================================================
   NORMALIZE DATE
========================================================= */

function normalizeDate(
  value: unknown
): string {
  if (!value) {
    return "";
  }

  const stringValue =
    String(value).trim();

  if (!stringValue) {
    return "";
  }

  return stringValue.slice(0, 10);
}

/* =========================================================
   DASHBOARD
========================================================= */

function DashboardPage() {
  const employee = getEmployee();

  /* =======================================================
     ATTENDANCE STATE
  ======================================================= */

  const [attendance, setAttendance] =
    useState<AttendanceRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* =======================================================
     LEAVE STATE
  ======================================================= */

  const [leaveRequests, setLeaveRequests] =
    useState<LeaveRequest[]>([]);

  const [leaveLoading, setLeaveLoading] =
    useState(true);

  /* =======================================================
     TODAY
  ======================================================= */

  const today =
    new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  const todayString =
    new Date()
      .toISOString()
      .slice(0, 10);

  /* =======================================================
     TODAY'S ATTENDANCE
  ======================================================= */

  const todayAttendance =
    useMemo(() => {
      if (!attendance.length) {
        return undefined;
      }

      const exactMatch =
        attendance.find((record) => {
          return (
            normalizeDate(
              record.Date
            ) === todayString
          );
        });

      return (
        exactMatch ||
        attendance[0]
      );
    }, [
      attendance,
      todayString,
    ]);

  /* =======================================================
     LOGGED-IN STATUS
  ======================================================= */

  const isLoggedIn =
    !!todayAttendance &&
    !!todayAttendance["Login Time"] &&
    !todayAttendance["Logout Time"];

  /* =======================================================
     RECENT ATTENDANCE
  ======================================================= */

  const recentAttendance:
    AttendanceRow[] =
    attendance
      .slice(0, 5)
      .map((record) => ({
        date:
          record.Date || "—",

        loginTime:
          record["Login Time"] || "",

        logoutTime:
          record["Logout Time"] || "",

        totalHours:
          record["Total Hours"] || "",

        status:
          record.Status ||
          "Present",
      }));

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    if (!employee?.email) {
      setLoading(false);
      setLeaveLoading(false);
      return;
    }

    loadAttendance();
    loadLeaveRequests();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee?.email]);

  /* =======================================================
     LOAD ATTENDANCE
  ======================================================= */

  async function loadAttendance() {
    if (!employee?.email) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result =
        await getAttendance(
          employee.email
        );

      if (result.success) {
        setAttendance(
          result.attendance || []
        );
      } else {
        setError(
          result.message ||
            "Unable to load attendance."
        );
      }
    } catch {
      setError(
        "Unable to load attendance."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     LOAD LEAVE REQUESTS
  ======================================================= */

  async function loadLeaveRequests() {
    if (!employee?.email) {
      setLeaveLoading(false);
      return;
    }

    setLeaveLoading(true);

    try {
      const result =
        await getLeaves(
          employee.email
        );

      console.log(
        "Cornixe leave response:",
        result
      );

      if (result.success) {
        setLeaveRequests(
          Array.isArray(
            result.leaves
          )
            ? (result.leaves as LeaveRequest[])
            : []
        );
      } else {
        console.error(
          "Unable to load leave requests:",
          result.message
        );

        setLeaveRequests([]);
      }
    } catch (err) {
      console.error(
        "Leave request fetch error:",
        err
      );

      setLeaveRequests([]);
    } finally {
      setLeaveLoading(false);
    }
  }

  /* =======================================================
     LEAVE COUNTS
  ======================================================= */

  const pendingLeaves =
    leaveRequests.filter(
      (leave) =>
        String(
          leave.Status || ""
        ).toLowerCase() ===
        "pending"
    ).length;

  const approvedLeaves =
    leaveRequests.filter(
      (leave) =>
        String(
          leave.Status || ""
        ).toLowerCase() ===
        "approved"
    ).length;

  const rejectedLeaves =
    leaveRequests.filter(
      (leave) =>
        String(
          leave.Status || ""
        ).toLowerCase() ===
        "rejected"
    ).length;

  /* =======================================================
     LEAVE STATUS STYLE
  ======================================================= */

  function getLeaveStatusClass(
    status: string
  ) {
    const value =
      status.toLowerCase();

    if (value === "approved") {
      return "bg-green-100 text-green-700";
    }

    if (value === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  }

  /* =======================================================
     ATTENDANCE LOGIN / LOGOUT
  ======================================================= */

  async function handleAttendance() {
    if (!employee) {
      setError(
        "Employee information not found. Please log in again."
      );
      return;
    }

    setActionLoading(true);
    setMessage("");
    setError("");

    try {
      /* LOGOUT */

      if (isLoggedIn) {
        const result =
          await attendanceLogout(
            employee.email
          );

        if (!result.success) {
          setError(
            result.message ||
              "Unable to log out."
          );

          return;
        }

        setMessage(
          `Logged out successfully. Total hours: ${
            result.totalHours ||
            "N/A"
          }`
        );

        await loadAttendance();

        return;
      }

      /* LOGIN */

      const result =
        await attendanceLogin(
          employee
        );

      if (!result.success) {
        setError(
          result.message ||
            "Unable to mark attendance."
        );

        return;
      }

      setMessage(
        `Attendance marked successfully${
          result.loginTime
            ? ` at ${result.loginTime}`
            : "."
        }`
      );

      await loadAttendance();

    } catch {
      setError(
        "Unable to connect to the Cornixe server."
      );
    } finally {
      setActionLoading(false);
    }
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <PortalLayout
      title="Dashboard"
      description="Your attendance at a glance"
    >
      <div className="space-y-6">

        {/* =================================================
            GREETING
        ================================================= */}

        <div>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            {greeting()},{" "}

            <span className="text-gradient-brand">
              {employee?.name?.split(
                " "
              )[0] ||
                "Employee"}
            </span>
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {today}
          </p>
        </div>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {message && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* =================================================
            MAIN DASHBOARD CARDS

            IMPORTANT:
            Both cards have the SAME HEIGHT on desktop.
        ================================================= */}

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-stretch">

          {/* =================================================
              ATTENDANCE CARD
          ================================================= */}

          <div className="min-h-[360px] [&>section]:h-full">

            <AttendanceCard
              isLoggedIn={isLoggedIn}
              loading={actionLoading}
              onAttendance={
                handleAttendance
              }
              todayAttendance={
                todayAttendance
              }
            />

          </div>

          {/* =================================================
              LEAVE CARD
          ================================================= */}

          <section className="card-surface flex min-h-[360px] flex-col p-5 sm:p-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex shrink-0 items-start justify-between gap-3">

              <div>

                <h3 className="text-sm font-semibold text-foreground">
                  Leave balance
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your leave requests
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  window.location.href =
                    "/apply-leave";
                }}
                className="text-xs font-medium text-brand-blue hover:underline"
              >
                Apply Leave
              </button>

            </div>

            {/* =================================================
                REQUEST HEADER
            ================================================= */}

            <div className="mt-4 shrink-0">

              <div className="flex items-center justify-between text-sm">

                <span className="font-medium text-foreground">
                  Leave Requests
                </span>

                <span className="text-muted-foreground">
                  {leaveLoading
                    ? "Loading..."
                    : `${leaveRequests.length} ${
                        leaveRequests.length ===
                        1
                          ? "request"
                          : "requests"
                      }`}
                </span>

              </div>

            </div>

            {/* =================================================
                LEAVE CONTENT
            ================================================= */}

            <div className="mt-4 min-h-[120px] flex-1">

              {/* LOADING */}

              {leaveLoading && (
                <div className="rounded-xl bg-secondary/50 px-4 py-5 text-center">

                  <p className="text-sm text-muted-foreground">
                    Fetching your leave
                    requests...
                  </p>

                </div>
              )}

              {/* NO REQUESTS */}

              {!leaveLoading &&
                leaveRequests.length ===
                  0 && (
                  <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center">

                    <p className="text-sm font-medium text-foreground">
                      No leave requests yet
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Your submitted leave
                      requests will appear
                      here.
                    </p>

                  </div>
                )}

              {/* =================================================
                  SCROLLABLE REQUEST LIST
              ================================================= */}

              {!leaveLoading &&
                leaveRequests.length >
                  0 && (
                  <div className="h-full min-h-0">

                    <div className="h-full max-h-[180px] space-y-2 overflow-y-auto pr-2">

                      {leaveRequests
                        .slice(0, 10)
                        .map(
                          (
                            leave,
                            index
                          ) => {

                            const status =
                              String(
                                leave.Status ||
                                  "Pending"
                              );

                            return (
                              <div
                                key={
                                  leave[
                                    "Request ID"
                                  ] ||
                                  index
                                }
                                className="rounded-xl border border-border bg-secondary/30 p-3"
                              >

                                <div className="flex items-start justify-between gap-3">

                                  <div className="min-w-0">

                                    <p className="truncate text-sm font-medium text-foreground">
                                      {leave[
                                        "Leave Type"
                                      ] ||
                                        "Leave"}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                      {leave[
                                        "From Date"
                                      ] ||
                                        "—"}

                                      {" → "}

                                      {leave[
                                        "To Date"
                                      ] ||
                                        "—"}
                                    </p>

                                    {leave.Days && (
                                      <p className="mt-1 text-xs text-muted-foreground">
                                        {leave.Days}{" "}
                                        day
                                        {Number(
                                          leave.Days
                                        ) ===
                                        1
                                          ? ""
                                          : "s"}
                                      </p>
                                    )}

                                  </div>

                                  <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getLeaveStatusClass(
                                      status
                                    )}`}
                                  >
                                    {status}
                                  </span>

                                </div>

                              </div>
                            );
                          }
                        )}

                    </div>

                  </div>
                )}

            </div>

            {/* =================================================
                VIEW ALL
            ================================================= */}

            {!leaveLoading &&
              leaveRequests.length >
                3 && (
                <button
                  type="button"
                  onClick={() => {
                    window.location.href =
                      "/my-requests";
                  }}
                  className="mt-3 shrink-0 text-center text-xs font-medium text-brand-blue hover:underline"
                >
                  View all{" "}
                  {
                    leaveRequests.length
                  }{" "}
                  requests
                </button>
              )}

            {/* =================================================
                STATUS SUMMARY

                THIS STAYS AT THE BOTTOM
            ================================================= */}

            {!leaveLoading &&
              leaveRequests.length >
                0 && (
                <div className="mt-3 grid shrink-0 grid-cols-3 gap-2">

                  {/* PENDING */}

                  <div className="rounded-lg bg-yellow-50 p-2 text-center">

                    <p className="text-lg font-semibold text-yellow-700">
                      {pendingLeaves}
                    </p>

                    <p className="text-xs text-yellow-700">
                      Pending
                    </p>

                  </div>

                  {/* APPROVED */}

                  <div className="rounded-lg bg-green-50 p-2 text-center">

                    <p className="text-lg font-semibold text-green-700">
                      {approvedLeaves}
                    </p>

                    <p className="text-xs text-green-700">
                      Approved
                    </p>

                  </div>

                  {/* REJECTED */}

                  <div className="rounded-lg bg-red-50 p-2 text-center">

                    <p className="text-lg font-semibold text-red-700">
                      {rejectedLeaves}
                    </p>

                    <p className="text-xs text-red-700">
                      Rejected
                    </p>

                  </div>

                </div>
              )}

          </section>

        </div>

        {/* =================================================
            RECENT ATTENDANCE
        ================================================= */}

        <section className="space-y-3">

          <h3 className="text-sm font-semibold text-foreground">
            Recent attendance
          </h3>

          <DataTable
            columns={columns}
            rows={recentAttendance}
            emptyTitle={
              loading
                ? "Loading attendance..."
                : "No attendance records"
            }
            emptyDescription={
              loading
                ? "Fetching your attendance from Google Sheets."
                : "Your check-ins will appear here once you start logging hours."
            }
          />

        </section>

      </div>
    </PortalLayout>
  );
}