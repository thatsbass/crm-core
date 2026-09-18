import { Router } from "express";
import { AuthController } from "@modules/auth/auth.controller";

/**
 * Creates the authentication HTTP router.
 *
 * @param authController - Controller responsible for authentication requests.
 * @returns The configured authentication router.
 */
export default function authRoutes(authController: AuthController) {
  const router = Router();

  router.post("/register", authController.register.bind(authController));
  router.post("/login", authController.login.bind(authController));

  return router;
}
