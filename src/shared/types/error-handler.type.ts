

type ErrorHandler = {
  status: number;
  handle: (error: Error) => {
    status: string;
    message: string;
    details?: any;
  };
};

export { ErrorHandler };