import jwt from "jsonwebtoken";

export function verifyJwtToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export function verifyToken(request) {
  const authHeader = request.headers.get("authorization");
  const cookieToken = request.cookies.get("token")?.value;

  if (!authHeader?.startsWith("Bearer ") && !cookieToken) {
    return null;
  }

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "")
    : cookieToken;

  return verifyJwtToken(token);
}
