export type EmploymentStatus =
  | "active"
  | "on_leave"
  | "remote"
  | "hybrid"
  | "working"
  | "travelling"
  | "training"
  | "suspended"
  | "resigned"
  | "retired"
  | "terminated";

export type EmploymentType = "full_time" | "part_time" | "contract" | "intern";
export type PayrollFrequency = "monthly" | "bi_weekly" | "weekly";
export type PaymentMethodType = "bank" | "momo" | "card";
export type MomoNetwork = "MTN" | "Telecel" | "AirtelTigo";
export type LeaveType =
  | "annual"
  | "sick"
  | "emergency"
  | "maternity"
  | "study"
  | "compassionate";
export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface EmployeeProfile {
  id: string;
  employeeId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  altPhone?: string;
  residentialAddress: string;
  digitalAddress: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyRelationship: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  maritalStatus: string;
  preferredLanguage: string;
  bio?: string;
  avatarUrl?: string;
}

export interface EmploymentInfo {
  employeeId: string;
  department: string;
  position: string;
  employmentType: EmploymentType;
  manager: string;
  branch: string;
  dateJoined: string;
  salaryGrade: string;
  payrollFrequency: PayrollFrequency;
  status: EmploymentStatus;
}

export interface BankingInfo {
  employeeId: string;
  preferredMethod: PaymentMethodType;
  bankName?: string;
  bankAccountNumber?: string;
  accountName?: string;
  branch?: string;
  momoNetwork?: MomoNetwork;
  momoNumber?: string;
  momoRegisteredName?: string;
  cardNumber?: string;
  cardNetwork?: string;
  cardName?: string;
  pendingVerification?: boolean;
}

export interface SalaryPayment {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  grossSalary: number;
  bonus: number;
  allowances: number;
  deductions: number;
  tax: number;
  netSalary: number;
  status: "paid" | "pending" | "failed";
  paidAt?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
}

export interface LeaveBalance {
  employeeId: string;
  annual: number;
  sick: number;
  emergency: number;
  maternity: number;
  study: number;
  compassionate: number;
}

export interface EmployeeNotification {
  id: string;
  employeeId: string;
  title: string;
  message: string;
  type:
    | "salary_paid"
    | "payment_failed"
    | "payment"
    | "leave_approved"
    | "leave_rejected"
    | "profile_updated"
    | "announcement"
    | "system";
  read: boolean;
  createdAt: string;
}

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  hoursWorked?: number;
  status: "present" | "absent" | "late" | "remote";
}

export interface EmployeeTask {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  deadline: string;
  status: "pending" | "completed";
  priority: "low" | "medium" | "high";
}

export interface ApprovalRequest {
  id: string;
  type:
    | "bank_change"
    | "momo_change"
    | "profile_update"
    | "leave"
    | "salary_update"
    | "promotion"
    | "department_transfer"
    | "batch";
  title: string;
  requestedBy: string;
  employeeId?: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  details: string;
  amount?: number;
}

export interface ManagedEmployee {
  id: string;
  employeeId: string;
  companyId: string;
  name: string;
  email: string;
  department: string;
  position: string;
  manager: string;
  status: EmploymentStatus;
  dateJoined: string;
}
