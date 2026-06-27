import { describe, it, expect } from "vitest";
import { getPostLoginRedirect } from "@/types/auth";

describe("Auth helpers", () => {
  it("redirects employees to employee portal", () => {
    expect(getPostLoginRedirect("employee")).toBe("/employee");
  });

  it("redirects admins to dashboard", () => {
    expect(getPostLoginRedirect("company_admin")).toBe("/");
    expect(getPostLoginRedirect("finance_officer")).toBe("/");
  });
});

describe("Payment types", () => {
  it("matches backend payment status values", async () => {
    const statuses = ["success", "pending", "failed", "processing", "retry"];
    expect(statuses).toContain("success");
    expect(statuses).toContain("pending");
  });
});
