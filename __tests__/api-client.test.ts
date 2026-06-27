import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiFetch, ApiError, setToken, clearToken, getToken, TOKEN_KEY, API_BASE_URL } from "@/lib/api/client";

// ─── Token management ─────────────────────────────────────────────────────────

describe("Token management", () => {
  beforeEach(() => clearToken());

  it("stores token in localStorage", () => {
    setToken("test-token-abc");
    expect(localStorage.getItem(TOKEN_KEY)).toBe("test-token-abc");
  });

  it("retrieves stored token via getToken()", () => {
    setToken("my-token-123");
    expect(getToken()).toBe("my-token-123");
  });

  it("returns null when no token is set", () => {
    expect(getToken()).toBeNull();
  });

  it("clears token from localStorage", () => {
    setToken("to-be-cleared");
    clearToken();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(getToken()).toBeNull();
  });

  it("overwrites an existing token", () => {
    setToken("first-token");
    setToken("second-token");
    expect(getToken()).toBe("second-token");
  });
});

// ─── Authorization header ─────────────────────────────────────────────────────

describe("apiFetch — Authorization header", () => {
  beforeEach(() => {
    clearToken();
    vi.restoreAllMocks();
  });

  it("sends Authorization header when token exists", async () => {
    setToken("bearer-xyz");
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
    await apiFetch("/test");
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/test`,
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer bearer-xyz" }),
      })
    );
  });

  it("omits Authorization header when no token is set", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: "public" }), { status: 200 })
    );
    await apiFetch("/public");
    const callArgs = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = callArgs.headers as Record<string, string>;
    expect(headers.Authorization).toBeUndefined();
  });

  it("sends Content-Type when body is provided", async () => {
    setToken("t");
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 })
    );
    await apiFetch("/resource", { method: "POST", body: JSON.stringify({ foo: "bar" }) });
    const callArgs = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = callArgs.headers as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
  });

  it("omits Content-Type when no body is provided", async () => {
    setToken("t");
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );
    await apiFetch("/list");
    const callArgs = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = callArgs.headers as Record<string, string>;
    expect(headers["Content-Type"]).toBeUndefined();
  });
});

// ─── Error handling ───────────────────────────────────────────────────────────

describe("apiFetch — error handling", () => {
  beforeEach(() => {
    clearToken();
    vi.restoreAllMocks();
  });

  it("throws ApiError with status 401 on Unauthorized", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    );
    const err = await apiFetch("/protected").catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(401);
    expect((err as ApiError).message).toBe("Unauthorized");
  });

  it("throws ApiError with status 403 on Forbidden", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 })
    );
    const err = await apiFetch("/admin-only").catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(403);
  });

  it("throws ApiError with status 404 on Not Found", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Not found" }), { status: 404 })
    );
    const err = await apiFetch("/missing").catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(404);
    expect((err as ApiError).message).toBe("Not found");
  });

  it("throws ApiError with status 500 on server error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
    );
    const err = await apiFetch("/crash").catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(500);
  });

  it("falls back to statusText when error body has no error field", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response("Bad Gateway", { status: 502, statusText: "Bad Gateway" })
    );
    const err = await apiFetch("/gateway").catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(502);
  });

  it("returns undefined for 204 No Content", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response(null, { status: 204 }));
    const result = await apiFetch("/nothing");
    expect(result).toBeUndefined();
  });

  it("returns parsed JSON on success", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "1", name: "Test" }), { status: 200 })
    );
    const result = await apiFetch<{ id: string; name: string }>("/resource");
    expect(result.id).toBe("1");
    expect(result.name).toBe("Test");
  });

  it("uses the correct full URL", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 })
    );
    await apiFetch("/my/path");
    expect(fetchMock.mock.calls[0][0]).toBe(`${API_BASE_URL}/my/path`);
  });
});

// ─── ApiError class ───────────────────────────────────────────────────────────

describe("ApiError", () => {
  it("has name ApiError", () => {
    const err = new ApiError(400, "Bad request");
    expect(err.name).toBe("ApiError");
  });

  it("exposes status and message", () => {
    const err = new ApiError(422, "Validation failed");
    expect(err.status).toBe(422);
    expect(err.message).toBe("Validation failed");
  });

  it("is an instance of Error", () => {
    const err = new ApiError(500, "Boom");
    expect(err instanceof Error).toBe(true);
    expect(err instanceof ApiError).toBe(true);
  });
});
