import { ZodError } from "zod";
import { ErrorHandler } from "@shared/types/error-handler.type";

const errorHandlers: Record<string, ErrorHandler> = {
  NotFoundError: {
    status: 404,
    handle: (error) => ({
      status: "error",
      message: error.message,
    }),
  },
  InactiveClientError: {
    status: 403,
    handle: (error) => ({
      status: "error",
      message: error.message,
    }),
  },
  ZodError: {
    status: 400,
    handle: (error) => ({
      status: "error",
      message: "Validation error",
      details: (error as ZodError).issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    }),
  },
};

const defaultHandler: ErrorHandler = {
  status: 500,
  handle: () => ({
    status: "error",
    message: "Internal Server Error",
  }),
};

export { errorHandlers, defaultHandler };