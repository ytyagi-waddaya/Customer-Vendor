import jwt from "jsonwebtoken";
import { config } from "../config/app.config";

interface JwtPayload {
  id: string;
}

const JWT_SECRET = config.JWT_SECRET

export const generateJwtToken = (payload: JwtPayload) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};