import mongoose, { Document, Schema } from "mongoose";
import { IClient } from "@modules/clients/client.types";

const clientSchema: Schema = new Schema<IClient>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ClientModel = mongoose.model<IClient>("Client", clientSchema);

export { ClientModel };
