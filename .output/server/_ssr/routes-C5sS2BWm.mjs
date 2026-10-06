import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as Logo, t as Button } from "./button-DZgoqK_7.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as ArrowLeft, i as ShieldCheck, l as MapPin, o as RefreshCw, p as LoaderCircle, u as Mail, y as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as Label, t as Input } from "./label-C_eI0375.mjs";
import { o as requestOtp, s as verifyOtp } from "./api-CSZNxki3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C5sS2BWm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)("email");
	const [email, setEmail] = (0, import_react.useState)("");
	const [otp, setOtp] = (0, import_react.useState)("");
	const [requestId, setRequestId] = (0, import_react.useState)("");
	const [location, setLocation] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [resending, setResending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [secondsLeft, setSecondsLeft] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (step !== "otp" || secondsLeft <= 0) return;
		const timer = window.setInterval(() => {
			setSecondsLeft((seconds) => {
				if (seconds <= 1) {
					window.clearInterval(timer);
					return 0;
				}
				return seconds - 1;
			});
		}, 1e3);
		return () => {
			window.clearInterval(timer);
		};
	}, [step, secondsLeft]);
	const getCurrentLocation = () => {
		return new Promise((resolve, reject) => {
			if (!navigator.geolocation) {
				reject(/* @__PURE__ */ new Error("Location services are not supported by this browser."));
				return;
			}
			navigator.geolocation.getCurrentPosition((position) => {
				resolve({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					accuracy: position.coords.accuracy
				});
			}, (error) => {
				let message = "Unable to get your location.";
				switch (error.code) {
					case error.PERMISSION_DENIED:
						message = "Location permission was denied. Please allow location access and try again.";
						break;
					case error.POSITION_UNAVAILABLE:
						message = "Your current location could not be determined. Please try again.";
						break;
					case error.TIMEOUT: message = "Location request timed out. Please try again.";
				}
				reject(new Error(message));
			}, {
				enableHighAccuracy: true,
				timeout: 15e3,
				maximumAge: 0
			});
		});
	};
	const handleRequestOtp = async () => {
		setError("");
		const trimmedEmail = email.trim().toLowerCase();
		if (!trimmedEmail) {
			setError("Please enter your Cornixe work email.");
			return;
		}
		if (!trimmedEmail.endsWith("@cornixe.in")) {
			setError("Please use your Cornixe work email address.");
			return;
		}
		setLoading(true);
		setStep("checking");
		try {
			const currentLocation = await getCurrentLocation();
			setLocation(currentLocation);
			const result = await requestOtp(trimmedEmail, currentLocation.latitude, currentLocation.longitude);
			console.log("Cornixe OTP request:", result);
			if (!result.success) {
				if (result.code === "OUTSIDE_OFFICE") {
					const distance = result.distance ? `${Math.round(result.distance)} m` : "";
					setError(distance ? `You are approximately ${distance} from the Cornixe office. You must be within 100 metres to continue.` : "You must be within 100 metres of the Cornixe office to continue.");
				} else setError(result.message || "Unable to send OTP.");
				setStep("email");
				return;
			}
			setRequestId(result.requestId || "");
			setOtp("");
			setSecondsLeft((result.expiresInMinutes || 5) * 60);
			setStep("otp");
		} catch (error) {
			console.error("OTP request failed:", error);
			setError(error instanceof Error ? error.message : "Unable to verify your location.");
			setStep("email");
		} finally {
			setLoading(false);
		}
	};
	const handleVerifyOtp = async (e) => {
		e?.preventDefault();
		setError("");
		const trimmedOtp = otp.replace(/\D/g, "");
		if (trimmedOtp.length !== 6) {
			setError("Please enter the 6-digit OTP.");
			return;
		}
		if (!requestId) {
			setError("Your OTP request has expired. Please request a new OTP.");
			return;
		}
		setLoading(true);
		try {
			const currentLocation = await getCurrentLocation();
			setLocation(currentLocation);
			const result = await verifyOtp(email.trim().toLowerCase(), trimmedOtp, requestId, currentLocation.latitude, currentLocation.longitude);
			console.log("Cornixe OTP verification:", result);
			if (!result.success) {
				if (result.code === "OUTSIDE_OFFICE") setError("You are no longer within the 100-metre Cornixe office area.");
				else if (result.code === "OTP_EXPIRED") setError("Your OTP has expired. Please request a new one.");
				else if (result.code === "OTP_INVALID") setError(result.message || "Incorrect OTP. Please try again.");
				else setError(result.message || "Unable to verify OTP.");
				return;
			}
			if (!result.employee) {
				setError("Employee details were not returned by the server.");
				return;
			}
			localStorage.setItem("cornixe_employee", JSON.stringify(result.employee));
			navigate({ to: "/dashboard" });
		} catch (error) {
			console.error("OTP verification failed:", error);
			setError(error instanceof Error ? error.message : "Unable to verify OTP.");
		} finally {
			setLoading(false);
		}
	};
	const handleResendOtp = async () => {
		if (resending) return;
		setError("");
		setResending(true);
		try {
			const currentLocation = await getCurrentLocation();
			setLocation(currentLocation);
			const result = await requestOtp(email.trim().toLowerCase(), currentLocation.latitude, currentLocation.longitude);
			console.log("Cornixe OTP resend:", result);
			if (!result.success) {
				if (result.code === "OTP_COOLDOWN") setError(result.message || "Please wait before requesting another OTP.");
				else setError(result.message || "Unable to resend OTP.");
				return;
			}
			setRequestId(result.requestId || "");
			setOtp("");
			setSecondsLeft((result.expiresInMinutes || 5) * 60);
		} catch (error) {
			console.error("OTP resend failed:", error);
			setError(error instanceof Error ? error.message : "Unable to resend OTP.");
		} finally {
			setResending(false);
		}
	};
	const handleBack = () => {
		setStep("email");
		setOtp("");
		setRequestId("");
		setLocation(null);
		setError("");
		setSecondsLeft(0);
	};
	const formatTime = (totalSeconds) => {
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${minutes}:${String(seconds).padStart(2, "0")}`;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-gradient-surface grid min-h-screen lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center px-5 py-10 sm:px-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
					step === "email" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-8 text-2xl font-semibold text-foreground",
							children: "Employee Portal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-sm text-muted-foreground",
							children: "Sign in with your Cornixe work email to continue."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: (e) => {
								e.preventDefault();
								handleRequestOtp();
							},
							className: "mt-8 space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "email",
										children: "Work email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "email",
										type: "email",
										required: true,
										value: email,
										onChange: (e) => setEmail(e.target.value),
										placeholder: "name@cornixe.in",
										autoComplete: "email",
										disabled: loading
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-xl border border-primary/20 bg-primary/5 p-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-0.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-5 w-5 text-primary" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium text-foreground",
											children: "Location verification required"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs leading-relaxed text-muted-foreground",
											children: "You must be within 100 metres of the Cornixe office to request a login OTP."
										})] })]
									})
								}),
								error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600",
									children: error
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: loading,
									className: "bg-gradient-brand h-11 w-full text-base font-semibold text-white transition-opacity hover:opacity-90",
									children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }), "Checking location…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {}), "Continue"] })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-8 flex items-center gap-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), "Accounts are created by the Cornixe management team."]
						})
					] }),
					step === "checking" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-7 w-7 animate-pulse text-primary" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-6 text-2xl font-semibold text-foreground",
								children: "Checking your location"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground",
								children: "Please allow location access. We're verifying that you're within the Cornixe office area."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto mt-6 h-5 w-5 animate-spin text-primary" })
						]
					}),
					step === "otp" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleBack,
							disabled: loading,
							className: "mt-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-6 text-2xl font-semibold text-foreground",
							children: "Verify your email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-sm text-muted-foreground",
							children: "We've sent a 6-digit OTP to"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 flex items-center gap-2 text-sm font-medium text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-primary" }), email]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 shrink-0 text-green-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-green-700",
								children: "Location verified"
							}), location && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs text-green-600",
								children: "Your location has been verified successfully."
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleVerifyOtp,
							className: "mt-7 space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "otp",
										children: "Enter OTP"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "otp",
										inputMode: "numeric",
										autoComplete: "one-time-code",
										maxLength: 6,
										value: otp,
										onChange: (e) => {
											const value = e.target.value.replace(/\D/g, "").slice(0, 6);
											setOtp(value);
										},
										placeholder: "000000",
										className: "h-12 text-center text-xl font-semibold tracking-[0.45em]",
										disabled: loading,
										autoFocus: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-center text-sm text-muted-foreground",
									children: secondsLeft > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										"OTP expires in",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: formatTime(secondsLeft)
										})
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-600",
										children: "OTP expired"
									})
								}),
								error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600",
									children: error
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: loading || otp.length !== 6 || secondsLeft <= 0,
									className: "bg-gradient-brand h-11 w-full text-base font-semibold text-white transition-opacity hover:opacity-90",
									children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }), "Verifying…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {}), "Verify & Login"] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: handleResendOtp,
										disabled: resending || secondsLeft > 0,
										className: "flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:underline disabled:pointer-events-none disabled:opacity-50",
										children: resending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Sending…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" }), "Resend OTP"] })
									})
								})
							]
						})
					] })
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-gradient-brand relative hidden overflow-hidden lg:block",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/15 blur-3xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-0 bottom-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-white/10 blur-3xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex h-full flex-col justify-end p-12 text-white",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium tracking-[0.25em] uppercase opacity-80",
							children: "Empowering your vision"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 max-w-md text-3xl leading-snug font-semibold",
							children: "Attendance, working hours and leave — all in one calm workspace."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-sm text-sm opacity-85",
							children: "Securely sign in with your work email and location verification, then manage your attendance and leave requests from one place."
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { LoginPage as component };
