"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorLogger_1 = require("../helpers/ErrorLogger");
const errorHandler = (error, req, res, next) => {
    const message = error.message || "encounter error";
    const status = error.statusCode || 500;
    console.log("Error Message", message);
    res
        .status(status)
        .json({ message: message, error: "Error message", errorStatus: status });
    ErrorLogger_1.logger.error(`${error.statusCode || 500} - ${res.statusMessage} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
};
exports.default = errorHandler;
