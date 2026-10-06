import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as cn, t as Button } from "./button-DZgoqK_7.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Check, S as ChevronDown, b as ChevronUp, h as Info, p as LoaderCircle, y as CircleCheck } from "../_libs/lucide-react.mjs";
import { l as PortalLayout } from "./PortalLayout-CdVCS-Js.mjs";
import { n as Label, t as Input } from "./label-C_eI0375.mjs";
import { t as applyLeave } from "./api-CSZNxki3.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/apply-leave-BjyxUd3j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
function getEmployee() {
	try {
		const stored = localStorage.getItem("cornixe_employee");
		if (!stored) return null;
		return JSON.parse(stored);
	} catch {
		return null;
	}
}
function ApplyLeavePage() {
	const navigate = useNavigate();
	const employee = getEmployee();
	const [leaveType, setLeaveType] = (0, import_react.useState)("");
	const [from, setFrom] = (0, import_react.useState)("");
	const [to, setTo] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const [requestId, setRequestId] = (0, import_react.useState)("");
	const days = (0, import_react.useMemo)(() => {
		if (!from || !to) return 0;
		const start = /* @__PURE__ */ new Date(`${from}T00:00:00`);
		const diff = (/* @__PURE__ */ new Date(`${to}T00:00:00`)).getTime() - start.getTime();
		if (Number.isNaN(diff) || diff < 0) return 0;
		return Math.floor(diff / 864e5) + 1;
	}, [from, to]);
	const handleSubmit = async (e) => {
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
			reason: reason.trim()
		});
		setLoading(false);
		if (!result.success) {
			toast.error(result.message || "Unable to submit leave request.");
			return;
		}
		setRequestId(result.requestId || "");
		setSubmitted(true);
		toast.success("Leave request submitted", { description: "Your request has been sent to the management team for review." });
	};
	if (submitted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalLayout, {
		title: "Apply Leave",
		description: "Request time off",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-surface mx-auto max-w-lg p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "text-brand-blue mx-auto h-12 w-12" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-lg font-semibold text-foreground",
					children: "Leave request submitted"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: [
						"Your ",
						leaveType.toLowerCase(),
						" request for ",
						days,
						" ",
						days === 1 ? "day" : "days",
						" has been sent to the management team for review."
					]
				}),
				requestId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-xs font-medium text-muted-foreground",
					children: ["Request ID: ", requestId]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col justify-center gap-2 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "bg-gradient-brand text-white hover:opacity-90",
						onClick: () => navigate({ to: "/my-requests" }),
						children: "View my requests"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => {
							setSubmitted(false);
							setLeaveType("");
							setFrom("");
							setTo("");
							setReason("");
							setRequestId("");
						},
						children: "Apply for another leave"
					})]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalLayout, {
		title: "Apply Leave",
		description: "Request time off",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-3xl gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "card-surface space-y-5 p-5 sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "type",
							children: "Leave type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: leaveType,
							onValueChange: setLeaveType,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								id: "type",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select leave type" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
								"Casual Leave",
								"Sick Leave",
								"Personal Leave",
								"Other"
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: t,
								children: t
							}, t)) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "from",
									children: "From date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "from",
									type: "date",
									value: from,
									min: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
									onChange: (e) => setFrom(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "to",
									children: "To date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "to",
									type: "date",
									value: to,
									min: from || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
									onChange: (e) => setTo(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "days",
									children: "Number of days"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "days",
									value: days ? String(days) : "—",
									readOnly: true,
									className: "bg-secondary/60"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "reason",
							children: "Reason"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "reason",
							rows: 4,
							value: reason,
							onChange: (e) => setReason(e.target.value),
							placeholder: "Briefly describe the reason for your leave",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: loading,
						className: "bg-gradient-brand h-11 w-full text-base font-semibold text-white hover:opacity-90 sm:w-auto sm:px-8",
						children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }), "Submitting…"] }) : "Submit Leave Request"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3 rounded-xl border border-border bg-accent/50 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "text-brand-blue mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Leave requests are reviewed by the Cornixe management team. You will be notified once your request is approved or rejected, and the status will update under My Requests."
				})]
			})]
		})
	});
}
//#endregion
export { ApplyLeavePage as component };
