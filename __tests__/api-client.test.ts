import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiFetch, ApiError, setToken, clearToken, TOKEN_KEY } from "@/lib/api/client";

describe("API client", () => {
  beforeEach(() => {
    clearToken();
    vi.restoreAllMocks();
  });

  it("stores and clears auth token", () => {
    setToken("test-token");
    expect(localStorage.getItem(TOKEN_KEY)).toBe("test-token");
    clearToken();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it("sends Authorization header when token exists", async () => {
    setToken("abc123");
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );

    await apiFetch("/test");

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/test"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer abc123",
        }),
      })
    );
  });

  it("throws ApiError on failed response", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    );

    await expect(apiFetch("/protected")).rejects.toThrow(ApiError);
  });
});

describe("Role permissions", () => {
  it("grants finance officer approval permission", async () => {
    const { hasPermission } = await import("@/constants/roles");
    expect(hasPermission("finance_officer", "admin.approval")).toBe(true);
    expect(hasPermission("company_admin", "admin.approval")).toBe(false);
  });

  it("grants employee portal permissions", async () => {
    const { hasPermission } = await import("@/constants/roles");
    expect(hasPermission("employee", "employee.payments")).toBe(true);
    expect(hasPermission("employee", "admin.payments")).toBe(false);
  });
});
