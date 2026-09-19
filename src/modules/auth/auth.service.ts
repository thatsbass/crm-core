import bcrypt from "bcryptjs";
import { createHash, timingSafeEqual } from "node:crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import { ENV } from "@config/env";
import { ConflictError } from "@shared/errors/conflict.error";
import { UnauthorizedError } from "@shared/errors/unauthorized.error";
import { AUTH_MESSAGE } from "@modules/auth/auth.constant";
import { ClientModel } from "@modules/clients/client.model";
import { AuthResponse } from "@modules/auth/auth.types";
import { UserModel } from "@modules/users/user.model";
import { IUser, PublicUser, UserRole } from "@modules/users/user.types";

export class AuthService {
  /**
   * Registers a user and returns an access token.
   *
   * @param name - User display name.
   * @param email - User email address.
   * @param password - Plain text password to hash.
   * @returns The public user and signed JWT.
   * @throws ConflictError when the email is already registered.
   */
  async register(
    name: string,
    email: string,
    phone: string,
    address: string,
    password: string,
  ): Promise<AuthResponse> {
    if (await UserModel.exists({ email })) {
      throw new ConflictError(AUTH_MESSAGE.EMAIL_ALREADY_EXISTS);
    }
    if (await ClientModel.exists({ phone })) {
      throw new ConflictError(AUTH_MESSAGE.PHONE_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await UserModel.create({name, email, password: hashedPassword, role: UserRole.CLIENT,});
    try {
      await ClientModel.create({ userId: user.id, phone, address });
    } catch (error) {
      await UserModel.findByIdAndDelete(user.id).exec();
      throw error;
    }
    return this.createAuthResponse(user);
  }

  /**
   * Authenticates a user with email and password.
   *
   * @param email - User email address.
   * @param password - Plain text password.
   * @returns The public user and signed JWT.
   * @throws UnauthorizedError when credentials are invalid.
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await UserModel.findOne({ email }).select("+password").exec();
    if (!user || !user.isActive || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError(AUTH_MESSAGE.INVALID_CREDENTIALS);
    }

    return this.createAuthResponse(user);
  }

  /**
   * Creates the first administrator with the configured bootstrap code.
   *
   * @param accessCode - Secret code supplied by the deployer.
   * @param name - Administrator display name.
   * @param email - Administrator email address.
   * @param password - Plain text administrator password.
   * @returns The created administrator and a signed JWT.
   * @throws UnauthorizedError when bootstrap is disabled or the code is invalid.
   * @throws ConflictError when an administrator already exists.
   */
  async setupAdmin(
    accessCode: string,
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    if (!ENV.ADMIN_SETUP_ENABLED || !ENV.ADMIN_SETUP_KEY) {
      throw new UnauthorizedError(AUTH_MESSAGE.ADMIN_SETUP_DISABLED);
    }

    if (!this.matchesSetupKey(accessCode)) {
      throw new UnauthorizedError(AUTH_MESSAGE.ADMIN_SETUP_INVALID_KEY);
    }

    if (await UserModel.exists({ role: UserRole.ADMIN })) {
      throw new ConflictError(AUTH_MESSAGE.ADMIN_ALREADY_EXISTS);
    }

    if (await UserModel.exists({ email })) {
      throw new ConflictError(AUTH_MESSAGE.EMAIL_ALREADY_EXISTS);
    }

    const user = await UserModel.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      role: UserRole.ADMIN,
      isActive: true,
    });

    return this.createAuthResponse(user);
  }

  /**
   * Creates an administrator from an authenticated administrator account.
   *
   * @param name - Administrator display name.
   * @param email - Administrator email address.
   * @param password - Plain text administrator password.
   * @returns The created public administrator.
   * @throws ConflictError when the email is already registered.
   */
  async createAdmin(name: string, email: string, password: string): Promise<PublicUser> {
    if (await UserModel.exists({ email })) {
      throw new ConflictError(AUTH_MESSAGE.EMAIL_ALREADY_EXISTS);
    }

    const user = await UserModel.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      role: UserRole.ADMIN,
      isActive: true,
    });

    return this.toPublicUser(user);
  }

  /**
   * Creates a public authentication response.
   *
   * @param user - Persisted user.
   * @returns Public user data and signed JWT.
   */
  private createAuthResponse(user: IUser): AuthResponse {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const options: SignOptions = { expiresIn: ENV.JWT_EXPIRES_IN as SignOptions["expiresIn"] };

    return {
      user: this.toPublicUser(user),
      token: jwt.sign(payload, ENV.JWT_SECRET, options),
    };
  }

  /**
   * Removes sensitive fields from a persisted user.
   *
   * @param user - Persisted user.
   * @returns Public user representation.
   */
  private toPublicUser(user: IUser): PublicUser {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  /**
   * Compares bootstrap codes using fixed-length hashes and a timing-safe check.
   *
   * @param accessCode - Code received from the request.
   * @returns Whether the code matches the configured secret.
   */
  private matchesSetupKey(accessCode: string): boolean {
    const received = createHash("sha256").update(accessCode).digest();
    const expected = createHash("sha256").update(ENV.ADMIN_SETUP_KEY).digest();
    return timingSafeEqual(received, expected);
  }
}
