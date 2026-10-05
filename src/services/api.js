const API_URL = import.meta.env.VITE_API_URL;

async function request(action, data = {}) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action,
        ...data,
      }),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("API Error:", error);

    return {
      success: false,
      message: "Unable to connect to server",
    };
  }
}


// Employee
export function loginEmployee(email) {
  return request("login", {
    email,
  });
}


// Attendance login
export function attendanceLogin(employee) {
  return request("attendanceLogin", {
    email: employee.email,
    employeeId: employee.employeeId,
    employeeName: employee.name,
  });
}


// Attendance logout
export function attendanceLogout(email) {
  return request("attendanceLogout", {
    email,
  });
}


// Attendance history
export function getAttendance(email) {
  return request("getAttendance", {
    email,
  });
}


// Apply leave
export function applyLeave(data) {
  return request("applyLeave", data);
}


// Leave history
export function getLeaves(email) {
  return request("getLeaves", {
    email,
  });
}