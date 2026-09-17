import mongoose, { Document, Schema } from "mongoose";
import { ILog, LogStatusEnum } from "@modules/logs/log.types";

const logSchema = new Schema<ILog>({
  phone: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: Object.values(LogStatusEnum),
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const LogModel = mongoose.model<ILog>("Logger", logSchema);

export { LogModel, LogStatusEnum as LogStatus };
