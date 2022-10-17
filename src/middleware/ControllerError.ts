import { Error } from "../ts-interface--models/error-interfaces";

const throwError = (errorMsg: string, statusCode: number) => {
  const error: Error = new Error(errorMsg);
  error.statusCode = statusCode;
  throw error;
};

export { throwError };
