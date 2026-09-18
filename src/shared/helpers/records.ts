import { ZodError } from "zod";
import { ErrorHandler } from "@shared/types/error-handler.type";
import { HTTP_STATUS } from "@shared/constants/http.constant";

const errorHandlers: Record<string, ErrorHandler> = {
  NotFoundError: {
    status: HTTP_STATUS.NOT_FOUND,
    handle: (error) => ({
      status: "error",
      message: error.message,
    }),
  },
  InactiveClientError: {
    status: HTTP_STATUS.FORBIDDEN,
    handle: (error) => ({
      status: "error",
      message: error.message,
    }),
  },
  ZodError: {
    status: HTTP_STATUS.BAD_REQUEST,
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
  status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  handle: () => ({
    status: "error",
    message: "Internal Server Error",
  }),
};

export { errorHandlers, defaultHandler };