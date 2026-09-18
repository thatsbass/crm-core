import { Document, Types } from "mongoose";

export enum UserRole {
  CLIENT = "CLIENT",
  AGENT = "AGENT",
  ADMIN = "ADMIN",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface ClientUserReference {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}
