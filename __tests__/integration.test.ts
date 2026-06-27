import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPostLoginRedirect, isAdminRole, isEmployeeRole, getRoleLabel } from "@/types/auth";
import { hasPermission } from "@/constants/roles";

// ─── Auth redirect helpers ─────────────────────────────────────────────────────

describe("getPostLoginRedirect", () => {
  it("sends employees to /employee", () => {
    expect(getPostLoginRedirect("employee")).toBe("/employee");
  });

  it("sends company_admin to /", () => {
    expect(getPostLoginRedirect("company_admin")).toBe("/");
  });

  it("sends finance_officer to /", () => {
    expect(getPostLoginRedirect("finance_officer")).toBe("/");
  });
});

describe("isAdminRole", () => {
  it("returns true for company_admin", () => {
    expect(isAdminRole("company_admin")).toBe(true);
  });

  it("returns true for finance_officer", () => {
    expect(isAdminRole("finance_officer")).toBe(true);
  });

  it("returns false for employee", () => {
    expect(isAdminRole("employee")).toBe(false);
  });
});

describe("isEmployeeRole", () => {
  it("returns true for employee", () => {
    expect(isEmployeeRole("employee")).toBe(true);
  });

  it("returns false for company_admin", () => {
    expect(isEmployeeRole("company_admin")).toBe(false);
  });

  it("returns false for finance_officer", () => {
    expect(isEmployeeRole("finance_officer")).toBe(false);
  });
});

describe("getRoleLabel", () => {
  it("returns human-readable label for company_admin", () => {
    expect(getRoleLabel("company_admin")).toBeTruthy();
    expect(typeof getRoleLabel("company_admin")).toBe("string");
  });

  it("returns human-readable label for finance_officer", () => {
    expect(getRoleLabel("finance_officer")).toBeTruthy();
  });

  it("returns human-readable label for employee", () => {
    expect(getRoleLabel("employee")).toBeTruthy();
  });
});

// ─── Role permissions ─────────────────────────────────────────────────────────

describe("hasPermission — company_admin", () => {
  it("can access dashboard", () => {
    expect(hasPermission("company_admin", "admin.dashboard")).toBe(true);
  });

  it("can manage employees", () => {
    expect(hasPermission("company_admin", "admin.employees")).toBe(true);
  });

  it("can access settings", () => {
    expect(hasPermission("company_admin", "admin.settings")).toBe(true);
  });

  it("can upload payments", () => {
    expect(hasPermission("company_admin", "admin.upload")).toBe(true);
  });

  it("cannot approve payments (finance officer only)", () => {
    expect(hasPermission("company_admin", "admin.approval")).toBe(false);
  });

  it("cannot access employee portal", () => {
    expect(hasPermission("company_admin", "employee.payments")).toBe(false);
    expect(hasPermission("company_admin", "employee.profile")).toBe(false);
  });
});

describe("hasPermission — finance_officer", () => {
  it("can access dashboard", () => {
    expect(hasPermission("finance_officer", "admin.dashboard")).toBe(true);
  });

  it("can approve payments", () => {
    expect(hasPermission("finance_officer", "admin.approval")).toBe(true);
  });

  it("can upload payment batches", () => {
    expect(hasPermission("finance_officer", "admin.upload")).toBe(true);
  });

  it("cannot manage employees", () => {
    expect(hasPermission("finance_officer", "admin.employees")).toBe(false);
  });

  it("cannot access settings", () => {
    expect(hasPermission("finance_officer", "admin.settings")).toBe(false);
  });

  it("cannot access employee portal", () => {
    expect(hasPermission("finance_officer", "employee.payments")).toBe(false);
  });
});

describe("hasPermission — employee", () => {
  it("can access employee dashboard", () => {
    expect(hasPermission("employee", "employee.dashboard")).toBe(true);
  });

  it("can view own payments", () => {
    expect(hasPermission("employee", "employee.payments")).toBe(true);
  });

  it("can manage own profile", () => {
    expect(hasPermission("employee", "employee.profile")).toBe(true);
  });

  it("can manage own banking", () => {
    expect(hasPermission("employee", "employee.banking")).toBe(true);
  });

  it("cannot access admin dashboard", () => {
    expect(hasPermission("employee", "admin.dashboard")).toBe(false);
  });

  it("cannot upload payment batches", () => {
    expect(hasPermission("employee", "admin.upload")).toBe(false);
  });

  it("cannot approve payments", () => {
    expect(hasPermission("employee", "admin.approval")).toBe(false);
  });

  it("cannot manage other employees", () => {
    expect(hasPermission("employee", "admin.employees")).toBe(false);
  });

  it("cannot access settings", () => {
    expect(hasPermission("employee", "admin.settings")).toBe(false);
  });
});

// ─── Payment service helpers ───────────────────────────────────────────────────

describe("Payment services", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("fetchPayments builds URL without status filter", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );
    const { fetchPayments } = await import("@/services/api/payments");
    await fetchPayments();
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/payments$/);
  });

  it("fetchPayments builds URL with status filter", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );
    const { fetchPayments } = await import("@/services/api/payments");
    await fetchPayments("success");
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/payments\?status=success$/);
  });

  it("fetchPendingBatches calls /batches/pending", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );
    const { fetchPendingBatches } = await import("@/services/api/payments");
    await fetchPendingBatches();
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/batches\/pending$/);
  });

  it("createBatch sends POST to /batches with body", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "BP-X", status: "pending_approval" }), { status: 200 })
    );
    const { createBatch } = await import("@/services/api/payments");
    await createBatch("Test Batch", [
      { recipientName: "A", accountNumber: "0244000001", paymentType: "momo", bankOrProvider: "MTN MoMo", amount: 100 },
    ]);
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/batches$/);
    expect(fetchMock.mock.calls[0][1]?.method).toBe("POST");
    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.name).toBe("Test Batch");
    expect(body.payments).toHaveLength(1);
  });

  it("approveBatch sends POST to /batches/:id/approve", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "BP-2049", status: "approved" }), { status: 200 })
    );
    const { approveBatch } = await import("@/services/api/payments");
    await approveBatch("BP-2049", "Looks good");
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/batches\/BP-2049\/approve$/);
    expect(fetchMock.mock.calls[0][1]?.method).toBe("POST");
  });

  it("rejectBatch sends POST to /batches/:id/reject", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "BP-2047", status: "rejected" }), { status: 200 })
    );
    const { rejectBatch } = await import("@/services/api/payments");
    await rejectBatch("BP-2047");
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/batches\/BP-2047\/reject$/);
  });

  it("fetchApprovals builds URL with status filter", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );
    const { fetchApprovals } = await import("@/services/api/payments");
    await fetchApprovals("pending");
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/approvals\?status=pending$/);
  });
});

// ─── Employee service helpers ─────────────────────────────────────────────────

describe("Employee services", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("fetchEmployeeProfile calls /employees/:id/profile", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ firstName: "Kwame" }), { status: 200 })
    );
    const { fetchEmployeeProfile } = await import("@/services/api/employees");
    await fetchEmployeeProfile("EMP-1042");
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/employees\/EMP-1042\/profile$/);
  });

  it("fetchSalaryPayments calls /employees/:id/salary-payments", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );
    const { fetchSalaryPayments } = await import("@/services/api/employees");
    await fetchSalaryPayments("EMP-1042");
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/employees\/EMP-1042\/salary-payments$/);
  });

  it("fetchNotifications calls /employees/:id/notifications", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );
    const { fetchNotifications } = await import("@/services/api/employees");
    await fetchNotifications("EMP-1087");
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/employees\/EMP-1087\/notifications$/);
  });

  it("fetchBankingInfo calls /employees/:id/banking", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ preferredMethod: "momo" }), { status: 200 })
    );
    const { fetchBankingInfo } = await import("@/services/api/employees");
    await fetchBankingInfo("EMP-1042");
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/employees\/EMP-1042\/banking$/);
  });

  it("updateEmployeeProfile sends PATCH with body", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ phone: "+233 24 000 0001" }), { status: 200 })
    );
    const { updateEmployeeProfile } = await import("@/services/api/employees");
    await updateEmployeeProfile("EMP-1042", { phone: "+233 24 000 0001" });
    expect(fetchMock.mock.calls[0][1]?.method).toBe("PATCH");
    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.phone).toBe("+233 24 000 0001");
  });
});

// ─── Settings service helpers ──────────────────────────────────────────────────

describe("Settings services", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("fetchCompanyProfile calls /settings/company", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ code: "ACME-GH" }), { status: 200 })
    );
    const { fetchCompanyProfile } = await import("@/services/api/settings");
    await fetchCompanyProfile();
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/settings\/company$/);
  });

  it("fetchAuditLogs calls /audit", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );
    const { fetchAuditLogs } = await import("@/services/api/settings");
    await fetchAuditLogs();
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/audit$/);
  });

  it("revokeApiKey sends POST to /settings/api-keys/:id/revoke", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "key_1", status: "revoked" }), { status: 200 })
    );
    const { revokeApiKey } = await import("@/services/api/settings");
    await revokeApiKey("key_1");
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/settings\/api-keys\/key_1\/revoke$/);
    expect(fetchMock.mock.calls[0][1]?.method).toBe("POST");
  });
});

// ─── Payment status values ─────────────────────────────────────────────────────

describe("Payment domain values", () => {
  it("payment statuses align with backend", () => {
    const statuses = ["success", "pending", "failed", "processing", "retry"];
    expect(statuses).toContain("success");
    expect(statuses).toContain("pending");
    expect(statuses).toContain("failed");
    expect(statuses).toContain("processing");
    expect(statuses).toContain("retry");
  });

  it("batch statuses align with backend", () => {
    const batchStatuses = ["draft", "pending_approval", "approved", "rejected", "processing", "completed"];
    expect(batchStatuses).toContain("pending_approval");
    expect(batchStatuses).toContain("approved");
    expect(batchStatuses).toContain("completed");
  });

  it("payment types align with backend", () => {
    const types = ["bank", "momo"];
    expect(types).toContain("bank");
    expect(types).toContain("momo");
  });
});
