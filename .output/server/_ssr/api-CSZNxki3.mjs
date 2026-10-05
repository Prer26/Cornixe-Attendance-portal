//#region node_modules/.nitro/vite/services/ssr/assets/api-CSZNxki3.js
var API_URL = "https://script.google.com/macros/s/AKfycbx3R-xSoX2bPxZiSXveh4iqh-X2bR-Ow0Zmbb5zWkqh16cEdkWm4B5X32jpKdeYEby-xQ/exec";
function callApi(params, timeoutMs = 3e4) {
	return new Promise((resolve) => {
		const callbackName = `cornixe_callback_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
		const script = document.createElement("script");
		let completed = false;
		let timeoutId;
		const cleanup = () => {
			if (timeoutId !== void 0) window.clearTimeout(timeoutId);
			try {
				delete window[callbackName];
			} catch {}
			script.remove();
		};
		const finish = (result) => {
			if (completed) return;
			completed = true;
			cleanup();
			resolve(result);
		};
		window[callbackName] = (result) => {
			finish(result);
		};
		const query = new URLSearchParams({
			...params,
			callback: callbackName
		});
		timeoutId = window.setTimeout(() => {
			finish({
				success: false,
				message: "Request timed out. Please check your connection and try again."
			});
		}, timeoutMs);
		script.async = true;
		script.onerror = () => {
			finish({
				success: false,
				message: "Unable to connect to the Cornixe server."
			});
		};
		script.onload = () => {
			if (!completed && params.action === "applyLeave") finish({
				success: true,
				message: "Leave request submitted successfully.",
				status: "Pending"
			});
		};
		script.src = `${API_URL}?${query.toString()}`;
		document.body.appendChild(script);
	});
}
function requestOtp(email, latitude, longitude) {
	return callApi({
		action: "requestOtp",
		email: email.trim().toLowerCase(),
		latitude: String(latitude),
		longitude: String(longitude)
	}, 3e4);
}
function verifyOtp(email, otp, requestId, latitude, longitude) {
	return callApi({
		action: "verifyOtp",
		email: email.trim().toLowerCase(),
		otp: otp.trim(),
		requestId: requestId.trim(),
		latitude: String(latitude),
		longitude: String(longitude)
	}, 3e4);
}
function attendanceLogin(employee) {
	return callApi({
		action: "attendanceLogin",
		employeeId: employee.employeeId,
		employeeName: employee.name,
		email: employee.email.trim().toLowerCase()
	});
}
function attendanceLogout(email) {
	return callApi({
		action: "attendanceLogout",
		email: email.trim().toLowerCase()
	});
}
function getAttendance(email) {
	return callApi({
		action: "getAttendance",
		email: email.trim().toLowerCase()
	});
}
function applyLeave(params) {
	return callApi({
		action: "applyLeave",
		employeeId: params.employeeId,
		employeeName: params.employeeName,
		email: params.email.trim().toLowerCase(),
		leaveType: params.leaveType,
		fromDate: params.fromDate,
		toDate: params.toDate,
		reason: params.reason
	}, 3e4);
}
function getLeaves(email) {
	return callApi({
		action: "getLeaves",
		email: email.trim().toLowerCase()
	});
}
//#endregion
export { getLeaves as a, getAttendance as i, attendanceLogin as n, requestOtp as o, attendanceLogout as r, verifyOtp as s, applyLeave as t };
