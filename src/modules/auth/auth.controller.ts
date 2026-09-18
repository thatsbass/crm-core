import { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "@modules/auth/auth.schema";
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
}
