import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-DZgoqK_7.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Save, d as LogOut, s as PenLine, t as X, w as Camera } from "../_libs/lucide-react.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, l as PortalLayout, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./PortalLayout-CdVCS-Js.mjs";
import { n as Label, t as Input } from "./label-C_eI0375.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-B4II3HKH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getEmployee() {
	try {
		const stored = localStorage.getItem("cornixe_employee");
		if (!stored) return null;
		return JSON.parse(stored);
	} catch {
		return null;
	}
}
function ProfilePage() {
	const navigate = useNavigate();
	const [employee, setEmployee] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [photo, setPhoto] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const currentEmployee = getEmployee();
		if (currentEmployee) {
			setEmployee(currentEmployee);
			setName(currentEmployee.name || "");
			setPhoto(currentEmployee.photo || "");
		}
	}, []);
	if (!employee) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalLayout, {
		title: "Profile",
		description: "Your employee details",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-surface mx-auto max-w-2xl p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold text-foreground",
					children: "Employee information not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Please sign in again to access your profile."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "bg-gradient-brand mt-6 text-white hover:opacity-90",
					onClick: () => navigate({ to: "/" }),
					children: "Go to Login"
				})
			]
		})
	});
	const fields = [
		{
			label: "Employee ID",
			value: employee.employeeId
		},
		{
			label: "Email",
			value: employee.email
		},
		{
			label: "Role",
			value: employee.role
		},
		{
			label: "Department",
			value: employee.department
		}
	];
	const handlePhotoChange = (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith("image/")) return;
		if (file.size > 2097152) {
			alert("Please choose an image smaller than 2 MB.");
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result;
			if (typeof result === "string") setPhoto(result);
		};
		reader.readAsDataURL(file);
	};
	const handleSave = () => {
		if (!name.trim()) {
			alert("Please enter your name.");
			return;
		}
		setSaving(true);
		const updatedEmployee = {
			...employee,
			name: name.trim(),
			photo
		};
		localStorage.setItem("cornixe_employee", JSON.stringify(updatedEmployee));
		setEmployee(updatedEmployee);
		setSaving(false);
		setEditing(false);
	};
	const handleCancel = () => {
		setName(employee.name || "");
		setPhoto(employee.photo || "");
		setEditing(false);
	};
	const handleLogout = () => {
		localStorage.removeItem("cornixe_employee");
		navigate({ to: "/" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PortalLayout, {
		title: "Profile",
		description: "Your employee details",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-surface overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gradient-brand h-28" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-6 pb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative -mt-12 h-24 w-24",
							children: [photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: photo,
								alt: employee.name,
								className: "h-24 w-24 rounded-full border-4 border-card object-cover shadow-md"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-gradient-brand flex h-24 w-24 items-center justify-center rounded-full border-4 border-card text-2xl font-semibold text-white shadow-md",
								children: employee.name?.charAt(0).toUpperCase() || "E"
							}), editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								htmlFor: "profile-photo",
								className: "absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-card bg-white text-slate-700 shadow-md transition hover:bg-slate-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "profile-photo",
									type: "file",
									accept: "image/*",
									className: "hidden",
									onChange: handlePhotoChange
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-start justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "min-w-0",
								children: !editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "truncate text-xl font-semibold text-foreground",
									children: employee.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: employee.role
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-full max-w-md space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "name",
										children: "Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "name",
										value: name,
										onChange: (e) => setName(e.target.value),
										placeholder: "Enter your name"
									})]
								})
							}), !editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setEditing(true),
								className: "shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4" }), "Edit Profile"]
							})]
						}),
						editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: "Click the camera icon to upload your profile photo. Maximum size: 2 MB."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2",
							children: fields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
									children: field.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1 truncate text-sm font-medium text-foreground",
									children: field.value || "—"
								})]
							}, field.label))
						}),
						editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-7 flex flex-col gap-2 border-t border-border pt-5 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: handleSave,
								disabled: saving,
								className: "bg-gradient-brand text-white hover:opacity-90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), saving ? "Saving..." : "Save Changes"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: handleCancel,
								disabled: saving,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), "Cancel"]
							})]
						})
					]
				})]
			}), !editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => setOpen(true),
				className: "w-full sm:w-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {}), "Logout"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Log out of the portal?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "You will need to sign in again with your Cornixe work email to continue." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Stay signed in" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: handleLogout,
				children: "Logout"
			})] })] })
		})]
	});
}
//#endregion
export { ProfilePage as component };
