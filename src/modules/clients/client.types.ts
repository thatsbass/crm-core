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
