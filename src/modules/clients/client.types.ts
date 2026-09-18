import { Document, Types } from "mongoose";

export interface IClient extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientPayload {
  userId: string;
  phone: string;
  address: string;
}

export interface ClientListQuery {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
  sortBy: "phone" | "createdAt" | "updatedAt";
  sortOrder: 1 | -1;
}
