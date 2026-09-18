import { PublicUser } from "@modules/users/user.types";

export interface AuthResponse {
  user: PublicUser;
  token: string;
}
