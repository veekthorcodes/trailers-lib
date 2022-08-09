import jwt from "jsonwebtoken";

export async function verifyToken(token) {
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded?.issuer;
  }
  return null;
}
