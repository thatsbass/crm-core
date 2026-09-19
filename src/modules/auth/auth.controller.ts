import { NextFunction, Request, Response } from "express";
import {
  createAdminSchema,
  loginSchema,
  registerSchema,
  setupAdminSchema,
} from "@modules/auth/auth.schema";
import { AuthService } from "@modules/auth/auth.service";

export class AuthController {
  /**
   * Creates an authentication controller.
   *
   * @param authService - Service responsible for authentication use cases.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new user.
   *
   * @param req - HTTP request containing registration data.
   * @param res - HTTP response containing the public user and token.
   * @param next - Express error handler callback.
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = registerSchema.parse(req.body);
      const result = await this.authService.register(
        payload.name,
        payload.email,
        payload.phone,
        payload.address,
        payload.password,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Authenticates an existing user.
   *
   * @param req - HTTP request containing login credentials.
   * @param res - HTTP response containing the public user and token.
   * @param next - Express error handler callback.
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = loginSchema.parse(req.body);
      const result = await this.authService.login(payload.email, payload.password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Creates the first administrator through the protected bootstrap flow.
   *
   * @param req - HTTP request containing the access code and admin data.
   * @param res - HTTP response containing the administrator and token.
   * @param next - Express error handler callback.
   */
  async setupAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = setupAdminSchema.parse(req.body);
      const result = await this.authService.setupAdmin(
        payload.accessCode,
        payload.name,
        payload.email,
        payload.password,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Creates an additional administrator from an authenticated admin account.
   *
   * @param req - HTTP request containing administrator data.
   * @param res - HTTP response containing the created administrator.
   * @param next - Express error handler callback.
   */
  async createAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = createAdminSchema.parse(req.body);
      const user = await this.authService.createAdmin(payload.name, payload.email, payload.password);
      res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  }
}
