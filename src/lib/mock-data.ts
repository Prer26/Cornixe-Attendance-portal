export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export const employee = {
  name: "Prerana Iyengar",
  initials: "PN",
  employeeId: "CRX-1042",
  email: "prerana.nair@cornixe.com",
  role: "Senior Product Designer",
  department: "Design & Experience",
  joiningDate: "12 March 2023",
};

export type AttendanceRow = {
  date: string;
  loginTime: string;
  logoutTime: string;
  totalHours: string;
  status: "Present" | "Half Day" | "Leave";
};

export const recentAttendance: AttendanceRow[] = [
  { date: "26 Sep 2026", loginTime: "09:42 AM", logoutTime: "06:31 PM", totalHours: "8h 49m", status: "Present" },
  { date: "25 Sep 2026", loginTime: "09:58 AM", logoutTime: "06:12 PM", totalHours: "8h 14m", status: "Present" },
  { date: "24 Sep 2026", loginTime: "10:05 AM", logoutTime: "02:20 PM", totalHours: "4h 15m", status: "Half Day" },
  { date: "23 Sep 2026", loginTime: "—", logoutTime: "—", totalHours: "—", status: "Leave" },
  { date: "22 Sep 2026", loginTime: "09:31 AM", logoutTime: "06:48 PM", totalHours: "9h 17m", status: "Present" },
  { date: "21 Sep 2026", loginTime: "09:47 AM", logoutTime: "06:05 PM", totalHours: "8h 18m", status: "Present" },
];

export type LeaveRequest = {
  id: string;
  type: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
};

export const leaveRequests: LeaveRequest[] = [
  {
    id: "LR-2094",
    type: "Casual Leave",
    from: "02 Oct 2026",
    to: "03 Oct 2026",
    days: 2,
    reason: "Family function out of town",
    status: "Pending",
    appliedOn: "27 Sep 2026",
  },
  {
    id: "LR-2071",
    type: "Sick Leave",
    from: "23 Sep 2026",
    to: "23 Sep 2026",
    days: 1,
    reason: "Fever and doctor consultation",
    status: "Approved",
    appliedOn: "22 Sep 2026",
  },
  {
    id: "LR-2043",
    type: "Personal Leave",
    from: "08 Sep 2026",
    to: "10 Sep 2026",
    days: 3,
    reason: "Apartment shifting",
    status: "Approved",
    appliedOn: "01 Sep 2026",
  },
  {
    id: "LR-1998",
    type: "Other",
    from: "18 Aug 2026",
    to: "19 Aug 2026",
    days: 2,
    reason: "Certification exam preparation",
    status: "Rejected",
    appliedOn: "14 Aug 2026",
  },
];

export const leaveBalance = [
  { label: "Casual Leave", used: 4, total: 12 },
  { label: "Sick Leave", used: 2, total: 8 },
  { label: "Personal Leave", used: 3, total: 6 },
];
