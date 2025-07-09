import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import "dotenv/config";

const SECRET = process.env.JWT_SECRET || "";

export function JWTToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, SECRET);

      req.query.params = decoded;
    } catch (err) {}
  }

  next();
}
