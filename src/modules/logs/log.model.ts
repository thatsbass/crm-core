import mongoose, { Document, Schema } from "mongoose";
import { ILog, LogStatusEnum } from "@modules/logs/log.types";

const logSchema = new Schema<ILog>({
  clientId: { type: Schema.Types.ObjectId, ref: "Client" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  phone: { type: String },
  status: {
    type: String,
    required: true,
    enum: Object.values(LogStatusEnum),
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const LogModel = mongoose.models.Logger
  ? mongoose.model<ILog>("Logger")
  : mongoose.model<ILog>("Logger", logSchema);

export { LogModel, LogStatusEnum as LogStatus };
