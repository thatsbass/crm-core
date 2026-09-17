import { Document } from "mongoose";

export enum LogStatusEnum {
  SUCCESS = "SUCCESS",
  NOT_FOUND = "NOT_FOUND",
  INACTIVE = "INACTIVE",
  ERROR = "ERROR",
}

export interface ILog extends Document {
  phone: string;
  status: LogStatusEnum;
  message: string;
  timestamp: Date;
}
