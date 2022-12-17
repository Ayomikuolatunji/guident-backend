"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const { createLogger, format, transports } = require("winston");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Import mongodb
require("winston-mongodb");
exports.logger = createLogger({
    transports: [
        // File transport
        new transports.File({
            filename: "../logs/server.log",
            format: format.combine(format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }), format.align(), format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`)),
        }),
        // MongoDB transport
        new transports.MongoDB({
            level: "error",
            //mongo database connection link
            db: process.env.MONGODB_KEY,
            options: {
                useUnifiedTopology: true,
            },
            // A collection to save json formatted logs
            collection: "server_logs",
            format: format.combine(format.timestamp(), 
            // Convert logs to a json format
            format.json()),
        }),
    ],
});
