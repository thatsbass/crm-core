import { NextFunction, Request, Response } from "express";
import { UserRole } from "@modules/users/user.types";
import { AUTH_MESSAGE } from "@modules/auth/auth.constant";
import { ForbiddenError } from "@shared/errors/forbidden.error";

/**
 * Restricts a route to the supplied user roles.
 *
 * @param roles - Roles allowed to access the route.
 * @returns Express middleware enforcing role-based access.
 */
export function authorizeRoles(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role as UserRole)) {
      next(new ForbiddenError(AUTH_MESSAGE.ACCESS_DENIED));
      return;
    }

    next();
  };
}
