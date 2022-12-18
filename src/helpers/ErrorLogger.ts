const { createLogger, format, transports } = require("winston");
import dotenv from "dotenv";

dotenv.config();

// Import mongodb
require("winston-mongodb");

export const logger = createLogger({
  transports: [
    // File transport
    new transports.File({
      filename: "logs/server.log",
      format: format.combine(
        format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        format.align(),
        format.printf(
          (info: {
            level: string;
            info: string;
            timestamp: Date;
            message: string;
          }) => `${info.level}: ${[info.timestamp]}: ${info.message}`
        )
      ),
    }),

    // MongoDB transport
    new transports.MongoDB({
      level: "error",
      //mongo database connection link
      db: process.env.MONGODB_KEY as string,
      options: {
        useUnifiedTopology: true,
      },
      // A collection to save json formatted logs
      collection: "server_logs",
      format: format.combine(
        format.timestamp(),
        // Convert logs to a json format
        format.json()
      ),
    }),
  ],
});
