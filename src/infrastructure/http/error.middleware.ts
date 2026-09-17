import { Request, Response, NextFunction } from "express";

import { defaultHandler, errorHandlers } from "@shared/helpers/records";
import { STATUS_CODE } from "@shared/helpers/constant";
import { LogModel, LogStatus } from "@modules/logs/log.model";

export const errorMiddleware = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO: Remove console logs in production
  console.error("Error:", error.message);

  const handler = errorHandlers[error.constructor.name] || defaultHandler;

  if (handler.status === STATUS_CODE.INTERNAL_ERROR) {
    await LogModel.create({
      phone: req.params.phone ?? "N/A",
      message: handler.handle(error).message,
      status: LogStatus.ERROR,
    });
  }
  return res.status(handler.status).json(handler.handle(error));
};
