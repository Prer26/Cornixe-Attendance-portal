import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as cn } from "./button-DZgoqK_7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DataTable-B7vXr4H6.js
var import_jsx_runtime = require_jsx_runtime();
var toneMap = {
	Approved: "success",
	Present: "success",
	"Logged In": "success",
	Pending: "pending",
	"Half Day": "pending",
	Rejected: "danger",
	Leave: "info",
	"Logged Out": "neutral"
};
var toneStyles = {
	success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
	pending: "bg-amber-50 text-amber-700 ring-amber-200",
	danger: "bg-rose-50 text-rose-700 ring-rose-200",
	info: "bg-sky-50 text-sky-700 ring-sky-200",
	neutral: "bg-secondary text-secondary-foreground ring-border"
};
function StatusBadge({ status, className }) {
	const tone = toneMap[status] ?? "neutral";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset", toneStyles[tone], className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-current opacity-70" }), status]
	});
}
function DataTable({ columns, rows, loading = false, emptyTitle = "Nothing here yet", emptyDescription, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("card-surface overflow-hidden", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[640px] border-collapse text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
					className: "border-b border-border bg-secondary/60",
					children: columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: cn("px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase", col.className),
						children: col.header
					}, col.key))
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
					className: "border-b border-border last:border-0",
					children: columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 w-24 animate-pulse rounded-full bg-muted" })
					}, col.key))
				}, i)) : rows.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
					className: "border-b border-border transition-colors last:border-0 hover:bg-accent/40",
					children: columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: cn("px-4 py-4 align-middle", col.className),
						children: col.render(row)
					}, col.key))
				}, i)) })]
			})
		}), !loading && rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center gap-1 px-6 py-14 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-foreground",
				children: emptyTitle
			}), emptyDescription ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-sm text-sm text-muted-foreground",
				children: emptyDescription
			}) : null]
		}) : null]
	});
}
//#endregion
export { StatusBadge as n, DataTable as t };
