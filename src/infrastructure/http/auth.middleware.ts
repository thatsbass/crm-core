import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "@config/env";
import { AUTH_MESSAGE } from "@modules/auth/auth.constant";
import { UnauthorizedError } from "@shared/errors/unauthorized.error";
import { UserRole } from "@modules/users/user.types";

/**
 * Protects a route with a Bearer JWT.
 *
 * @param req - HTTP request containing the authorization header.
 * @param res - HTTP response.
 * @param next - Express middleware callback.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedError(AUTH_MESSAGE.TOKEN_REQUIRED);
    }

    const token = header.slice(7);
    const payload = jwt.verify(token, ENV.JWT_SECRET);
    if (
      typeof payload !== "object" ||
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      !Object.values(UserRole).includes(payload.role as UserRole)
    ) {
      throw new UnauthorizedError(AUTH_MESSAGE.TOKEN_INVALID);
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role as UserRole,
    };
    next();
  } catch (error) {
    next(error instanceof UnauthorizedError ? error : new UnauthorizedError(AUTH_MESSAGE.TOKEN_INVALID));
  }
}
