import { NextFunction, Request, Response } from "express";
import { logger } from "../helpers/ErrorLogger";
import { requestError } from "../ts-interface--models/error-interfaces";

const errorHandler = (
  error: requestError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = error.message || "encounter error";
  const status = error.statusCode || 500;
  console.log("Error Message", message);

  res
    .status(status)
    .json({ message: message, error: "Error message", errorStatus: status });
  logger.error(
    `${error.statusCode || 500} - ${res.statusMessage} - ${message} - ${
      req.originalUrl
    } - ${req.method} - ${req.ip}`
  );
};

export default errorHandler;
