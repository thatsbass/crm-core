import mongoose, { Schema } from "mongoose";
import { IClient } from "@modules/clients/client.types";

const clientSchema: Schema = new Schema<IClient>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    phone: { type: String, required: true, unique: true, trim: true },
    address: { type: String, required: true, trim: true },
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true },
);

const ClientModel = mongoose.models.Client
  ? mongoose.model<IClient>("Client")
  : mongoose.model<IClient>("Client", clientSchema);

export { ClientModel };
