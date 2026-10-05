import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { l as PortalLayout } from "./PortalLayout-CdVCS-Js.mjs";
import { a as getLeaves } from "./api-CSZNxki3.mjs";
import { n as StatusBadge, t as DataTable } from "./DataTable-B7vXr4H6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/my-requests-D0h0txPr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var columns = [
	{
		key: "Request ID",
		header: "Request ID",
		render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: r["Request ID"]
		})
	},
	{
		key: "Leave Type",
		header: "Leave Type",
		render: (r) => r["Leave Type"]
	},
	{
		key: "From Date",
		header: "From",
		render: (r) => r["From Date"]
	},
	{
		key: "To Date",
		header: "To",
		render: (r) => r["To Date"]
	},
	{
		key: "Days",
		header: "Days",
		render: (r) => r.Days
	},
	{
		key: "Reason",
		header: "Reason",
		className: "max-w-[220px]",
		render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block truncate text-muted-foreground",
			children: r.Reason
		})
	},
	{
		key: "Status",
		header: "Status",
		render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.Status })
	},
	{
		key: "Applied On",
		header: "Applied On",
		render: (r) => r["Applied On"]
	}
];
function getEmployeeEmail() {
	try {
		const stored = localStorage.getItem("cornixe_employee");
		if (!stored) return "";
		return JSON.parse(stored).email || "";
	} catch {
		return "";
	}
}
function MyRequestsPage() {
	const [leaveRequests, setLeaveRequests] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
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
		if (result.success) setLeaveRequests(result.leaves || []);
		else setError(result.message || "Unable to load leave requests.");
		setLoading(false);
	}
	const pending = leaveRequests.filter((request) => request.Status === "Pending").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalLayout, {
		title: "My Requests",
		description: "History of your leave applications",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: loading ? "Loading your leave requests..." : `${leaveRequests.length} requests in total · ${pending} awaiting review`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
					columns,
					rows: leaveRequests,
					emptyTitle: loading ? "Loading leave requests..." : "No leave requests yet",
					emptyDescription: loading ? "Fetching your requests from Google Sheets." : "Once you apply for leave, every request will be listed here with its status."
				})
			]
		})
	});
}
//#endregion
export { MyRequestsPage as component };
