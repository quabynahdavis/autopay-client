import type {
  AttendanceRecord,
  BankingInfo,
  EmployeeDocument,
  EmployeeNotification,
  EmployeeProfile,
  EmployeeTask,
  EmploymentInfo,
  LeaveBalance,
  LeaveRequest,
  ManagedEmployee,
  SalaryPayment,
  ApprovalRequest,
} from "@/types/employee";
import { getRegisteredProfile } from "@/lib/auth-store";
import { getCompanyEmployees } from "@/services/mock/users";

export const employeeProfiles: Record<string, EmployeeProfile> = {
  "EMP-1042": {
    id: "ep_1",
    employeeId: "EMP-1042",
    userId: "usr_6",
    firstName: "Kwame",
    lastName: "Asante",
    email: "kwame.asante@acmecorp.com.gh",
    phone: "+233 24 412 3456",
    altPhone: "+233 55 987 6543",
    residentialAddress: "12 Osu Badu Street, Accra",
    digitalAddress: "GA-123-4567",
    emergencyContactName: "Abena Asante",
    emergencyContactNumber: "+233 20 876 5432",
    emergencyRelationship: "Spouse",
    dateOfBirth: "1992-03-15",
    gender: "Male",
    nationality: "Ghanaian",
    maritalStatus: "Married",
    preferredLanguage: "English",
    bio: "Operations specialist with 5 years at Acme Corporation.",
  },
  "EMP-1087": {
    id: "ep_2",
    employeeId: "EMP-1087",
    userId: "usr_7",
    firstName: "Ama",
    lastName: "Serwaa",
    email: "ama.serwaa@acmecorp.com.gh",
    phone: "+233 55 598 7654",
    residentialAddress: "45 Ring Road Central, Accra",
    digitalAddress: "GA-456-7890",
    emergencyContactName: "Kofi Serwaa",
    emergencyContactNumber: "+233 24 111 2233",
    emergencyRelationship: "Brother",
    dateOfBirth: "1995-08-22",
    gender: "Female",
    nationality: "Ghanaian",
    maritalStatus: "Single",
    preferredLanguage: "English",
  },
  "CON-0021": {
    id: "ep_3",
    employeeId: "CON-0021",
    userId: "usr_8",
    firstName: "Kofi",
    lastName: "Mensah",
    email: "kofi.mensah@contractors.com.gh",
    phone: "+233 20 876 5432",
    residentialAddress: "8 Spintex Road, Accra",
    digitalAddress: "GA-789-0123",
    emergencyContactName: "Efua Mensah",
    emergencyContactNumber: "+233 27 765 4321",
    emergencyRelationship: "Sister",
    dateOfBirth: "1988-11-10",
    gender: "Male",
    nationality: "Ghanaian",
    maritalStatus: "Married",
    preferredLanguage: "English",
  },
};

export const employmentInfo: Record<string, EmploymentInfo> = {
  "EMP-1042": {
    employeeId: "EMP-1042",
    department: "Operations",
    position: "Operations Specialist",
    employmentType: "full_time",
    manager: "Sarah Osei",
    branch: "Accra HQ",
    dateJoined: "2021-06-01",
    salaryGrade: "Grade 5",
    payrollFrequency: "monthly",
    status: "active",
  },
  "EMP-1087": {
    employeeId: "EMP-1087",
    department: "Sales",
    position: "Sales Executive",
    employmentType: "full_time",
    manager: "James Adom",
    branch: "Accra HQ",
    dateJoined: "2022-01-15",
    salaryGrade: "Grade 4",
    payrollFrequency: "monthly",
    status: "hybrid",
  },
  "CON-0021": {
    employeeId: "CON-0021",
    department: "IT",
    position: "Software Consultant",
    employmentType: "contract",
    manager: "Michael Tetteh",
    branch: "Remote",
    dateJoined: "2025-09-01",
    salaryGrade: "Contractor Rate",
    payrollFrequency: "monthly",
    status: "remote",
  },
};

export const bankingInfo: Record<string, BankingInfo> = {
  "EMP-1042": {
    employeeId: "EMP-1042",
    preferredMethod: "momo",
    momoNetwork: "MTN",
    momoNumber: "0244123456",
    momoRegisteredName: "Kwame Asante",
  },
  "EMP-1087": {
    employeeId: "EMP-1087",
    preferredMethod: "bank",
    bankName: "GCB Bank",
    bankAccountNumber: "1234567890123",
    accountName: "Ama Serwaa",
    branch: "Ring Road",
  },
  "CON-0021": {
    employeeId: "CON-0021",
    preferredMethod: "momo",
    momoNetwork: "Telecel",
    momoNumber: "0208765432",
    momoRegisteredName: "Kofi Mensah",
  },
};

export const salaryPayments: SalaryPayment[] = [
  {
    id: "sal_1",
    employeeId: "EMP-1042",
    month: "June",
    year: 2026,
    grossSalary: 8500,
    bonus: 500,
    allowances: 800,
    deductions: 200,
    tax: 1275,
    netSalary: 8325,
    status: "paid",
    paidAt: "2026-06-25T10:00:00Z",
  },
  {
    id: "sal_2",
    employeeId: "EMP-1042",
    month: "May",
    year: 2026,
    grossSalary: 8500,
    bonus: 0,
    allowances: 800,
    deductions: 200,
    tax: 1275,
    netSalary: 7825,
    status: "paid",
    paidAt: "2026-05-25T10:00:00Z",
  },
  {
    id: "sal_3",
    employeeId: "EMP-1042",
    month: "July",
    year: 2026,
    grossSalary: 8500,
    bonus: 0,
    allowances: 800,
    deductions: 200,
    tax: 1275,
    netSalary: 7825,
    status: "pending",
  },
  {
    id: "sal_4",
    employeeId: "EMP-1087",
    month: "June",
    year: 2026,
    grossSalary: 7200,
    bonus: 300,
    allowances: 600,
    deductions: 150,
    tax: 1080,
    netSalary: 6870,
    status: "paid",
    paidAt: "2026-06-25T10:00:00Z",
  },
];

export const leaveBalances: Record<string, LeaveBalance> = {
  "EMP-1042": { employeeId: "EMP-1042", annual: 12, sick: 5, emergency: 3, maternity: 0, study: 2, compassionate: 2 },
  "EMP-1087": { employeeId: "EMP-1087", annual: 15, sick: 5, emergency: 3, maternity: 90, study: 2, compassionate: 2 },
  "CON-0021": { employeeId: "CON-0021", annual: 0, sick: 0, emergency: 0, maternity: 0, study: 0, compassionate: 0 },
};

export const leaveRequests: LeaveRequest[] = [
  {
    id: "lv_1",
    employeeId: "EMP-1042",
    employeeName: "Kwame Asante",
    type: "annual",
    startDate: "2026-07-10",
    endDate: "2026-07-14",
    days: 5,
    reason: "Family vacation",
    status: "pending",
    createdAt: "2026-06-20T09:00:00Z",
  },
  {
    id: "lv_2",
    employeeId: "EMP-1042",
    employeeName: "Kwame Asante",
    type: "sick",
    startDate: "2026-03-05",
    endDate: "2026-03-06",
    days: 2,
    reason: "Medical appointment",
    status: "approved",
    createdAt: "2026-03-04T08:00:00Z",
  },
  {
    id: "lv_3",
    employeeId: "EMP-1087",
    employeeName: "Ama Serwaa",
    type: "annual",
    startDate: "2026-08-01",
    endDate: "2026-08-15",
    days: 11,
    reason: "Annual leave",
    status: "pending",
    createdAt: "2026-06-22T11:00:00Z",
  },
];

export const employeeNotifications: EmployeeNotification[] = [
  {
    id: "not_1",
    employeeId: "EMP-1042",
    title: "Salary Paid",
    message: "Your June 2026 salary of GHS 8,325.00 has been credited.",
    type: "salary_paid",
    read: false,
    createdAt: "2026-06-25T10:05:00Z",
  },
  {
    id: "not_2",
    employeeId: "EMP-1042",
    title: "Leave Request Pending",
    message: "Your annual leave request (Jul 10–14) is awaiting approval.",
    type: "system",
    read: false,
    createdAt: "2026-06-20T09:05:00Z",
  },
  {
    id: "not_3",
    employeeId: "EMP-1042",
    title: "Company Announcement",
    message: "Office closed on July 1 for Republic Day. Enjoy the holiday!",
    type: "announcement",
    read: true,
    createdAt: "2026-06-18T14:00:00Z",
  },
  {
    id: "not_4",
    employeeId: "EMP-1042",
    title: "Profile Updated",
    message: "Your emergency contact information was updated successfully.",
    type: "profile_updated",
    read: true,
    createdAt: "2026-06-15T16:30:00Z",
  },
];

export const employeeDocuments: EmployeeDocument[] = [
  { id: "doc_1", employeeId: "EMP-1042", name: "Ghana Card", type: "National ID", uploadedAt: "2024-06-01T10:00:00Z", size: "1.2 MB" },
  { id: "doc_2", employeeId: "EMP-1042", name: "Employment Contract", type: "Contract", uploadedAt: "2021-06-01T09:00:00Z", size: "856 KB" },
  { id: "doc_3", employeeId: "EMP-1042", name: "BSc Certificate", type: "Certificate", uploadedAt: "2021-06-01T09:30:00Z", size: "2.1 MB" },
];

export const attendanceRecords: AttendanceRecord[] = [
  { id: "att_1", employeeId: "EMP-1042", date: "2026-06-27", clockIn: "08:02", clockOut: "17:15", hoursWorked: 9.2, status: "present" },
  { id: "att_2", employeeId: "EMP-1042", date: "2026-06-26", clockIn: "08:15", clockOut: "17:00", hoursWorked: 8.75, status: "late" },
  { id: "att_3", employeeId: "EMP-1042", date: "2026-06-25", clockIn: "07:55", clockOut: "17:10", hoursWorked: 9.25, status: "present" },
];

export const employeeTasks: EmployeeTask[] = [
  { id: "task_1", employeeId: "EMP-1042", title: "Complete Q2 Operations Report", description: "Submit quarterly operations summary to manager.", deadline: "2026-06-30", status: "pending", priority: "high" },
  { id: "task_2", employeeId: "EMP-1042", title: "Update Safety Training", description: "Complete online safety certification module.", deadline: "2026-07-05", status: "pending", priority: "medium" },
  { id: "task_3", employeeId: "EMP-1042", title: "Vendor Onboarding Review", description: "Review and approve 3 new vendor applications.", deadline: "2026-06-20", status: "completed", priority: "low" },
];

export const managedEmployees: ManagedEmployee[] = [
  { id: "me_1", employeeId: "EMP-1042", companyId: "comp_acme", name: "Kwame Asante", email: "kwame.asante@acmecorp.com.gh", department: "Operations", position: "Staff", manager: "Sarah Osei", status: "active", dateJoined: "2021-06-01" },
  { id: "me_2", employeeId: "EMP-1087", companyId: "comp_acme", name: "Ama Serwaa", email: "ama.serwaa@acmecorp.com.gh", department: "Sales", position: "Staff", manager: "James Adom", status: "active", dateJoined: "2022-01-15" },
  { id: "me_3", employeeId: "EMP-1098", companyId: "comp_acme", name: "Efua Boateng", email: "efua.boateng@acmecorp.com.gh", department: "Finance", position: "Staff", manager: "James Adom", status: "active", dateJoined: "2023-03-10" },
  { id: "me_4", employeeId: "EMP-1105", companyId: "comp_acme", name: "Kofi Darko", email: "kofi.darko@acmecorp.com.gh", department: "Finance", position: "Staff", manager: "Sarah Osei", status: "on_leave", dateJoined: "2020-08-15" },
  { id: "me_5", employeeId: "EMP-1118", companyId: "comp_acme", name: "Kofi Mensah", email: "kofi.mensah@acmecorp.com.gh", department: "IT", position: "Staff", manager: "James Adom", status: "active", dateJoined: "2025-09-01" },
  { id: "me_6", employeeId: "EMP-1112", companyId: "comp_acme", name: "Grace Akoto", email: "grace.akoto@acmecorp.com.gh", department: "Operations", position: "Team Lead", manager: "Sarah Osei", status: "active", dateJoined: "2019-11-01" },
];

export const employeeApprovalRequests: ApprovalRequest[] = [
  { id: "apr_1", type: "momo_change", title: "MoMo Number Change", requestedBy: "Kwame Asante", employeeId: "EMP-1042", date: "2026-06-26T14:00:00Z", status: "pending", details: "Change MTN MoMo from 0244123456 to 0244998877" },
  { id: "apr_2", type: "leave", title: "Annual Leave Request", requestedBy: "Kwame Asante", employeeId: "EMP-1042", date: "2026-06-20T09:00:00Z", status: "pending", details: "5 days annual leave, Jul 10–14" },
  { id: "apr_3", type: "leave", title: "Annual Leave Request", requestedBy: "Ama Serwaa", employeeId: "EMP-1087", date: "2026-06-22T11:00:00Z", status: "pending", details: "11 days annual leave, Aug 1–15" },
  { id: "apr_4", type: "profile_update", title: "Profile Update", requestedBy: "Kwame Asante", employeeId: "EMP-1042", date: "2026-06-15T16:00:00Z", status: "approved", details: "Updated emergency contact information" },
  { id: "apr_5", type: "bank_change", title: "Bank Account Change", requestedBy: "Efua Boateng", employeeId: "EMP-1098", date: "2026-06-24T10:00:00Z", status: "pending", details: "Switch from Ecobank to GCB Bank" },
];

export function getEmployeeProfile(employeeId: string): EmployeeProfile | undefined {
  const registered = getRegisteredProfile(employeeId);
  if (registered) return registered as unknown as EmployeeProfile;
  return employeeProfiles[employeeId];
}

export function getCompanyTeam(companyId: string): ManagedEmployee[] {
  const team = managedEmployees.filter((e) => e.companyId === companyId);
  const knownIds = new Set(team.map((e) => e.employeeId));

  for (const user of getCompanyEmployees(companyId)) {
    if (!user.employeeId || knownIds.has(user.employeeId)) continue;
    knownIds.add(user.employeeId);
    team.push({
      id: user.id,
      employeeId: user.employeeId,
      companyId: user.companyId,
      name: user.name,
      email: user.email,
      department: "—",
      position: "Staff",
      manager: "—",
      status: "active",
      dateJoined: new Date().toISOString().slice(0, 10),
    });
  }

  return team;
}

export function getEmploymentInfo(employeeId: string): EmploymentInfo | undefined {
  return employmentInfo[employeeId];
}

export function getBankingInfo(employeeId: string): BankingInfo | undefined {
  return bankingInfo[employeeId];
}

export function getEmployeePayments(employeeId: string): SalaryPayment[] {
  return salaryPayments.filter((p) => p.employeeId === employeeId);
}

export function getEmployeeLeave(employeeId: string): LeaveRequest[] {
  return leaveRequests.filter((l) => l.employeeId === employeeId);
}

export function getEmployeeNotifications(employeeId: string): EmployeeNotification[] {
  return employeeNotifications.filter((n) => n.employeeId === employeeId);
}

export function getEmployeeDocuments(employeeId: string): EmployeeDocument[] {
  return employeeDocuments.filter((d) => d.employeeId === employeeId);
}

export function getEmployeeAttendance(employeeId: string): AttendanceRecord[] {
  return attendanceRecords.filter((a) => a.employeeId === employeeId);
}

export function getEmployeeTasks(employeeId: string): EmployeeTask[] {
  return employeeTasks.filter((t) => t.employeeId === employeeId);
}

export function calculateProfileCompletion(profile: EmployeeProfile): number {
  const fields = [
    profile.firstName,
    profile.lastName,
    profile.phone,
    profile.email,
    profile.residentialAddress,
    profile.digitalAddress,
    profile.emergencyContactName,
    profile.emergencyContactNumber,
    profile.dateOfBirth,
    profile.gender,
    profile.nationality,
    profile.maritalStatus,
    profile.preferredLanguage,
  ];
  const filled = fields.filter((f) => f && String(f).trim()).length;
  return Math.round((filled / fields.length) * 100);
}
