const API_URL = import.meta.env.VITE_API_URL as string;


/* =========================================================*
 * TYPES*

*========================================================= */


export type Employee = {

  employeeId: string;

  name: string;

  email: string;

  role: string;

  department: string;

  profilePhoto?: string;

};


export type AttendanceRecord = {

  Date?: string;

  "Employee ID"?: string;

  "Employee Name"?: string;

  Email?: string;

  "Login Time"?: string;

  "Logout Time"?: string;

  "Total Hours"?: string;

  Status?: string;

  [key: string]: unknown;

};


export type LeaveRecord = {

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

  [key: string]: unknown;

};


export type ApiResponse = {

  success: boolean;


  message?: string;


  code?: string;


  employee?: Employee;


  loginTime?: string;


  logoutTime?: string;


  totalHours?: string;


  attendance?: AttendanceRecord[];


  leaves?: LeaveRecord[];


  requestId?: string;


  days?: number;


  status?: string;


  distance?: number;


  expiresInMinutes?: number;


  expiresAt?: string;


  deviceToken?: string;


  isNewDevice?: boolean;


  [key: string]: unknown;

};


/* =========================================================*
 * JSONP API CALL*

*========================================================= */


function callApi(

  params: Record<string, string>,

  timeoutMs = 30000

): Promise<ApiResponse> {

  return new Promise((resolve) => {

    if (!API_URL) {

      resolve({

        success: false,

        message: "Cornixe API URL is not configured.",

      });


      return;

    }


    const callbackName =

      `cornixe_callback\_${Date.now()}\_${Math.random()

        .toString(36)

        .slice(2, 10)}`;


    const script = document.createElement("script");


    let completed = false;


    let timeoutId: number | undefined;


    const cleanup = () => {

      if (timeoutId !== undefined) {

        window.clearTimeout(timeoutId);

      }


      try {

        delete (

          window as unknown as Record<string, unknown>

        )[callbackName];

      } catch {

        // Ignore cleanup errors

      }


      script.remove();

    };


    const finish = (result: ApiResponse) => {

      if (completed) return;


      completed = true;


      cleanup();


      resolve(result);

    };


    /*\**
 * \* Create global JSONP callback.*
 * */

    (

      window as unknown as Record<string, unknown>

    )[callbackName] = (result: ApiResponse) => {

      finish(result);

    };


    const query = new URLSearchParams({

      ...params,

      callback: callbackName,

    });


    /*\**
 * \* Prevent the UI from spinning forever.*
 * */

    timeoutId = window.setTimeout(() => {

      finish({

        success: false,

        message:

          "Request timed out. Please check your connection and try again.",

      });

    }, timeoutMs);


    script.async = true;


    script.onerror = () => {

      finish({

        success: false,

        message:

          "Unable to connect to the Cornixe server.",

      });

    };


    /*\**
 * \* Keep existing leave-submission behavior.*
 * */

    script.onload = () => {

      if (

        !completed &&

        params.action === "applyLeave"

      ) {

        finish({

          success: true,

          message:

            "Leave request submitted successfully.",

          status: "Pending",

        });

      }

    };


    script.src =

      `${API_URL}?${query.toString()}`;


    document.body.appendChild(script);

  });

}


/* =========================================================*
 * DEVICE TOKEN*

*========================================================= */


/*\**
 * \* Generates a unique device token for this browser.*
 * \**
 * \* The token is stored in localStorage so the same browser*
 * \* continues to use the same registered device.*
 * */

function createDeviceToken(): string {

  try {

    if (

      typeof crypto !== "undefined" &&

      typeof crypto.randomUUID === "function"

    ) {

      return crypto.randomUUID();

    }

  } catch {

    // Fall back below

  }


  return (

    `${Date.now()}-${Math.random()

      .toString(36)

      .slice(2)}-${Math.random()

      .toString(36)

      .slice(2)}`

  );

}


/*\**
 * \* Gets the device token assigned to this browser.*
 * \**
 * \* If the browser does not have one yet, a new token is*
 * \* generated and saved permanently in localStorage.*
 * */

export function getDeviceToken(): string {

  try {

    const existingToken =

      localStorage.getItem(

        "cornixe_device_token"

      );


    if (existingToken) {

      return existingToken;

    }


    const newToken =

      createDeviceToken();


    localStorage.setItem(

      "cornixe_device_token",

      newToken

    );


    return newToken;

  } catch {

    // localStorage unavailable

    return createDeviceToken();

  }

}


/*\**
 * \* Clears the registered device token from this browser.*
 * \**
 * \* Normally this should NOT be called during logout.*
 * \**
 * \* It is mainly useful if an admin resets the employee's*
 * \* registered device and the employee needs to register*
 * \* the browser again.*
 * */

export function clearDeviceToken(): void {

  try {

    localStorage.removeItem(

      "cornixe_device_token"

    );

  } catch {

    // Ignore storage errors

  }

}


/* =========================================================*
 * REQUEST OTP*

*========================================================= */


export function requestOtp(
  email: string,
  latitude: number,
  longitude: number
): Promise<ApiResponse> {
  const deviceToken = getDeviceToken();

  return callApi(
    {
      action: "requestOtp",
      email: email.trim().toLowerCase(),
      latitude: String(latitude),
      longitude: String(longitude),
      deviceToken,
    },
    30000
  );
}

/* =========================================================*
 * VERIFY OTP*

*========================================================= */


export function verifyOtp(

  email: string,

  otp: string,

  requestId: string,

  latitude: number,

  longitude: number

): Promise<ApiResponse> {

  const deviceToken =

    getDeviceToken();


  return callApi(

    {

      action: "verifyOtp",


      email: email

        .trim()

        .toLowerCase(),


      otp: otp.trim(),


      requestId: requestId.trim(),


      latitude: String(latitude),


      longitude: String(longitude),


      deviceToken,

    },

    30000

  );

}


/* =========================================================*
 * ATTENDANCE LOGIN*

*========================================================= */


export function attendanceLogin(

  employee: Employee

): Promise<ApiResponse> {

  return callApi({

    action: "attendanceLogin",


    employeeId:

      employee.employeeId,


    employeeName:

      employee.name,


    email: employee.email

      .trim()

      .toLowerCase(),

  });

}


/* =========================================================*
 * ATTENDANCE LOGOUT*

*========================================================= */


export function attendanceLogout(

  email: string

): Promise<ApiResponse> {

  return callApi({

    action: "attendanceLogout",


    email: email

      .trim()

      .toLowerCase(),

  });

}


/* =========================================================*
 * GET ATTENDANCE*

*========================================================= */


export function getAttendance(

  email: string

): Promise<ApiResponse> {

  return callApi({

    action: "getAttendance",


    email: email

      .trim()

      .toLowerCase(),

  });

}


/* =========================================================*
 * GET DASHBOARD DATA*
 * One request for attendance + leave requests.*

*========================================================= */


export function getDashboardData(

  email: string

): Promise<ApiResponse> {

  return callApi(

    {

      action: "getDashboardData",


      email: email

        .trim()

        .toLowerCase(),

    },

    30000

  );

}


/* =========================================================*
 * APPLY LEAVE*

*========================================================= */


export function applyLeave(params: {

  employeeId: string;

  employeeName: string;

  email: string;

  leaveType: string;

  fromDate: string;

  toDate: string;

  reason: string;

}): Promise<ApiResponse> {

  return callApi(

    {

      action: "applyLeave",


      employeeId:

        params.employeeId,


      employeeName:

        params.employeeName,


      email:

        params.email

          .trim()

          .toLowerCase(),


      leaveType:

        params.leaveType,


      fromDate:

        params.fromDate,


      toDate:

        params.toDate,


      reason:

        params.reason,

    },

    30000

  );

}


/* =========================================================*
 * GET LEAVE REQUESTS*

*========================================================= */


export function getLeaves(

  email: string

): Promise<ApiResponse> {

  return callApi({

    action: "getLeaves",


    email: email

      .trim()

      .toLowerCase(),

  });

}


/* =========================================================*
 * LOCAL STORAGE HELPERS*

*========================================================= */


export function getStoredEmployee():

  Employee | null {

  try {

    const stored =

      localStorage.getItem(

        "cornixe_employee"

      );


    if (!stored) {

      return null;

    }


    return JSON.parse(

      stored

    ) as Employee;

  } catch {

    return null;

  }

}


export function setStoredEmployee(

  employee: Employee

): void {

  localStorage.setItem(

    "cornixe_employee",

    JSON.stringify(employee)

  );

}


export function clearStoredEmployee(): void {

  localStorage.removeItem(

    "cornixe_employee"

  );

}