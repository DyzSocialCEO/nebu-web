import { timingSafeEqual } from "node:crypto";

export function isAdminRequest(request: Request) {
  const expected = process.env.ADMIN_API_KEY || "";
  const provided = request.headers.get("x-nebu-admin-key") || "";
  if (!expected || !provided) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  return a.length === b.length && timingSafeEqual(a, b);
}
