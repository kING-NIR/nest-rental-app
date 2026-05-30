import jwt, { SignOptions } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: { id: string; role: "owner" | "tenant" };
}

export const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" } as any
  );
};

export const verifyToken = (token: string): { id: string } | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };
  } catch {
    return null;
  }
};

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    req.user = decoded as any;
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};
