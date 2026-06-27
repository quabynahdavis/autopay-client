export type PaymentStatus =
  | "success"
  | "pending"
  | "failed"
  | "processing"
  | "retry";

export type PaymentType = "bank" | "momo" | "card";

export type BatchStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "processing"
  | "completed";

export interface Payment {
  id: string;
  recipientName: string;
  accountNumber: string;
  paymentType: PaymentType;
  bankOrProvider: string;
  amount: number;
  currency: "GHS";
  status: PaymentStatus;
  validation?: { valid: boolean; errors?: string[] };
  createdAt: string;
}

export interface Batch {
  id: string;
  name: string;
  requestedBy: string;
  approver?: string;
  totalAmount: number;
  recipientCount: number;
  bankCount: number;
  momoCount: number;
  status: BatchStatus;
  payments: Payment[];
  createdAt: string;
  warnings?: string[];
}
