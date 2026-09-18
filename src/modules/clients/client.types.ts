import { Document } from "mongoose";

export interface IClient extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ClientPayload = Omit<
  IClient,
  keyof Document | "isActive" | "createdAt" | "updatedAt"
>;

export interface ClientListQuery {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
  sortBy: "name" | "email" | "phone" | "createdAt" | "updatedAt";
  sortOrder: 1 | -1;
}
