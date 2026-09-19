import { Router } from "express";
import { authenticate } from "@infrastructure/http/auth.middleware";
import { authorizeRoles } from "@infrastructure/http/authorize.middleware";
import { AuthController } from "@modules/auth/auth.controller";
import { UserRole } from "@modules/users/user.types";

/**
 * Creates routes for user administration.
 *
 * @param authController - Controller responsible for user identity operations.
 * @returns The configured user administration router.
 */
export default function userRoutes(authController: AuthController) {
  const router = Router();

  router.post(
    "/admins",
    authenticate,
    authorizeRoles(UserRole.ADMIN),
    authController.createAdmin.bind(authController),
  );

  return router;
}
