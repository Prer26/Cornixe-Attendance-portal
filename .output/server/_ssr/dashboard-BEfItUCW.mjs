import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-DZgoqK_7.mjs";
import { _ as Clock, d as LogOut, f as LogIn, r as Timer } from "../_libs/lucide-react.mjs";
import { l as PortalLayout } from "./PortalLayout-CdVCS-Js.mjs";
import { a as getLeaves, i as getAttendance, n as attendanceLogin, r as attendanceLogout } from "./api-CSZNxki3.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as StatusBadge, t as DataTable } from "./DataTable-B7vXr4H6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-BEfItUCW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getWorkingHours(record) {
	if (!record) return "0h 00m";
	return record["Total Hours"] || "0h 00m";
}
function AttendanceCard({ isLoggedIn, loading, onAttendance, todayAttendance }) {
	const loginTime = todayAttendance?.["Login Time"] || null;
	const logoutTime = todayAttendance?.["Logout Time"] || null;
	const handleToggle = () => {
		onAttendance();
		if (isLoggedIn) toast.info("Logging out...", { description: "Recording your working hours for today." });
		else toast.info("Logging in...", { description: "Recording your attendance for today." });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "card-surface flex h-full flex-col justify-center p-5 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-muted-foreground",
						children: "Today's attendance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 truncate text-lg font-semibold text-foreground",
						children: isLoggedIn ? "You are checked in" : logoutTime ? "Day completed" : "Not checked in yet"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: isLoggedIn ? "Logged In" : logoutTime ? "Logged Out" : "Not Checked In" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: LogIn,
						label: "Login time",
						value: loginTime ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: LogOut,
						label: "Logout time",
						value: logoutTime ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: Timer,
						label: "Working hours",
						value: getWorkingHours(todayAttendance)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: handleToggle,
				disabled: loading,
				className: "bg-gradient-brand mt-6 h-12 w-full text-base font-semibold text-white shadow-[var(--shadow-raised)] transition-opacity hover:opacity-90",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "animate-spin" }), "Please wait…"] }) : isLoggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {}), "Log out for today"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, {}), "Log in for today"] })
			})
		]
	});
}
function Stat({ icon: Icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-secondary/50 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium tracking-wide uppercase",
				children: label
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-lg font-semibold text-foreground",
			children: value
		})]
	});
}
var columns = [
	{
		key: "date",
		header: "Date",
		render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: r.date || "—"
		})
	},
	{
		key: "loginTime",
		header: "Login Time",
		render: (r) => r.loginTime || "—"
	},
	{
		key: "logoutTime",
		header: "Logout Time",
		render: (r) => r.logoutTime || "—"
	},
	{
		key: "totalHours",
		header: "Total Hours",
		render: (r) => r.totalHours || "—"
	},
	{
		key: "status",
		header: "Status",
		render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.status || "Present" })
	}
];
function greeting() {
	const hour = (/* @__PURE__ */ new Date()).getHours();
	if (hour < 12) return "Good Morning";
	if (hour < 17) return "Good Afternoon";
	return "Good Evening";
}
function getEmployee() {
	try {
		const stored = localStorage.getItem("cornixe_employee");
		if (!stored) return null;
		return JSON.parse(stored);
	} catch {
		return null;
	}
}
function normalizeDate(value) {
	if (!value) return "";
	const stringValue = String(value).trim();
	if (!stringValue) return "";
	return stringValue.slice(0, 10);
}
function DashboardPage() {
	const employee = getEmployee();
	const [attendance, setAttendance] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [actionLoading, setActionLoading] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [leaveRequests, setLeaveRequests] = (0, import_react.useState)([]);
	const [leaveLoading, setLeaveLoading] = (0, import_react.useState)(true);
	const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric"
	});
	const todayString = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const todayAttendance = (0, import_react.useMemo)(() => {
		if (!attendance.length) return;
		return attendance.find((record) => {
			return normalizeDate(record.Date) === todayString;
		}) || attendance[0];
	}, [attendance, todayString]);
	const isLoggedIn = !!todayAttendance && !!todayAttendance["Login Time"] && !todayAttendance["Logout Time"];
	const recentAttendance = attendance.slice(0, 5).map((record) => ({
		date: record.Date || "—",
		loginTime: record["Login Time"] || "",
		logoutTime: record["Logout Time"] || "",
		totalHours: record["Total Hours"] || "",
		status: record.Status || "Present"
	}));
	(0, import_react.useEffect)(() => {
		if (!employee?.email) {
			setLoading(false);
			setLeaveLoading(false);
			return;
		}
		loadAttendance();
		loadLeaveRequests();
	}, [employee?.email]);
	async function loadAttendance() {
		if (!employee?.email) return;
		setLoading(true);
		setError("");
		try {
			const result = await getAttendance(employee.email);
			if (result.success) setAttendance(result.attendance || []);
			else setError(result.message || "Unable to load attendance.");
		} catch {
			setError("Unable to load attendance.");
		} finally {
			setLoading(false);
		}
	}
	async function loadLeaveRequests() {
		if (!employee?.email) {
			setLeaveLoading(false);
			return;
		}
		setLeaveLoading(true);
		try {
			const result = await getLeaves(employee.email);
			console.log("Cornixe leave response:", result);
			if (result.success) setLeaveRequests(Array.isArray(result.leaves) ? result.leaves : []);
			else {
				console.error("Unable to load leave requests:", result.message);
				setLeaveRequests([]);
			}
		} catch (err) {
			console.error("Leave request fetch error:", err);
			setLeaveRequests([]);
		} finally {
			setLeaveLoading(false);
		}
	}
	const pendingLeaves = leaveRequests.filter((leave) => String(leave.Status || "").toLowerCase() === "pending").length;
	const approvedLeaves = leaveRequests.filter((leave) => String(leave.Status || "").toLowerCase() === "approved").length;
	const rejectedLeaves = leaveRequests.filter((leave) => String(leave.Status || "").toLowerCase() === "rejected").length;
	function getLeaveStatusClass(status) {
		const value = status.toLowerCase();
		if (value === "approved") return "bg-green-100 text-green-700";
		if (value === "rejected") return "bg-red-100 text-red-700";
		return "bg-yellow-100 text-yellow-700";
	}
	async function handleAttendance() {
		if (!employee) {
			setError("Employee information not found. Please log in again.");
			return;
		}
		setActionLoading(true);
		setMessage("");
		setError("");
		try {
			if (isLoggedIn) {
				const result = await attendanceLogout(employee.email);
				if (!result.success) {
					setError(result.message || "Unable to log out.");
					return;
				}
				setMessage(`Logged out successfully. Total hours: ${result.totalHours || "N/A"}`);
				await loadAttendance();
				return;
			}
			const result = await attendanceLogin(employee);
			if (!result.success) {
				setError(result.message || "Unable to mark attendance.");
				return;
			}
			setMessage(`Attendance marked successfully${result.loginTime ? ` at ${result.loginTime}` : "."}`);
			await loadAttendance();
		} catch {
			setError("Unable to connect to the Cornixe server.");
		} finally {
			setActionLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalLayout, {
		title: "Dashboard",
		description: "Your attendance at a glance",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-xl font-semibold text-foreground sm:text-2xl",
					children: [
						greeting(),
						",",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gradient-brand",
							children: employee?.name?.split(" ")[0] || "Employee"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: today
				})] }),
				message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700",
					children: message
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-stretch",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-h-[360px] [&>section]:h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttendanceCard, {
							isLoggedIn,
							loading: actionLoading,
							onAttendance: handleAttendance,
							todayAttendance
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "card-surface flex min-h-[360px] flex-col p-5 sm:p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold text-foreground",
									children: "Leave balance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "Your leave requests"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										window.location.href = "/apply-leave";
									},
									className: "text-xs font-medium text-brand-blue hover:underline",
									children: "Apply Leave"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: "Leave Requests"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: leaveLoading ? "Loading..." : `${leaveRequests.length} ${leaveRequests.length === 1 ? "request" : "requests"}`
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 min-h-[120px] flex-1",
								children: [
									leaveLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-xl bg-secondary/50 px-4 py-5 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "Fetching your leave requests..."
										})
									}),
									!leaveLoading && leaveRequests.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-dashed border-border px-4 py-6 text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium text-foreground",
											children: "No leave requests yet"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted-foreground",
											children: "Your submitted leave requests will appear here."
										})]
									}),
									!leaveLoading && leaveRequests.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full min-h-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full max-h-[180px] space-y-2 overflow-y-auto pr-2",
											children: leaveRequests.slice(0, 10).map((leave, index) => {
												const status = String(leave.Status || "Pending");
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "rounded-xl border border-border bg-secondary/30 p-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-start justify-between gap-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "min-w-0",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																	className: "truncate text-sm font-medium text-foreground",
																	children: leave["Leave Type"] || "Leave"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																	className: "mt-1 text-xs text-muted-foreground",
																	children: [
																		leave["From Date"] || "—",
																		" → ",
																		leave["To Date"] || "—"
																	]
																}),
																leave.Days && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																	className: "mt-1 text-xs text-muted-foreground",
																	children: [
																		leave.Days,
																		" ",
																		"day",
																		Number(leave.Days) === 1 ? "" : "s"
																	]
																})
															]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: `shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getLeaveStatusClass(status)}`,
															children: status
														})]
													})
												}, leave["Request ID"] || index);
											})
										})
									})
								]
							}),
							!leaveLoading && leaveRequests.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									window.location.href = "/my-requests";
								},
								className: "mt-3 shrink-0 text-center text-xs font-medium text-brand-blue hover:underline",
								children: [
									"View all",
									" ",
									leaveRequests.length,
									" ",
									"requests"
								]
							}),
							!leaveLoading && leaveRequests.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid shrink-0 grid-cols-3 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg bg-yellow-50 p-2 text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-lg font-semibold text-yellow-700",
											children: pendingLeaves
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-yellow-700",
											children: "Pending"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg bg-green-50 p-2 text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-lg font-semibold text-green-700",
											children: approvedLeaves
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-green-700",
											children: "Approved"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg bg-red-50 p-2 text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-lg font-semibold text-red-700",
											children: rejectedLeaves
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-red-700",
											children: "Rejected"
										})]
									})
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-foreground",
						children: "Recent attendance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
						columns,
						rows: recentAttendance,
						emptyTitle: loading ? "Loading attendance..." : "No attendance records",
						emptyDescription: loading ? "Fetching your attendance from Google Sheets." : "Your check-ins will appear here once you start logging hours."
					})]
				})
			]
		})
	});
}
//#endregion
export { DashboardPage as component };
