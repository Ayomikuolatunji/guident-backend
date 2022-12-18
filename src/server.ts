import express, { Application } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import responseTime from "response-time";
import mongoDbConnection from "./database/mongoDB";
import requestHeaders from "./middleware/requestHeaders";
import errorHandler from "./middleware/requestErrorHandle";
import { pageNotFound } from "./middleware/404Page";
import v1Api from "./services/v1Apis";
import { logger } from "./helpers/ErrorLogger";
dotenv.config();

const app: Application = express();


// convert request to json using express middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// active cors policy for client accessibility
app.use(cors());

// client request headers
app.use(requestHeaders);

app.use(responseTime());

app.use(compression());

// version 1 api
app.use("/api", v1Api);
// page not found
app.use(pageNotFound);

// express client error handle
app.use(errorHandler);

// connecting server
(async function startConnection() {
  try {
    app.listen(process.env.PORT! || 8000, () => {
      console.log(`App running on port ${process.env.PORT}`);
      logger.info(`Server started and running on  ${process.env.PORT}`);
      console.log("console log dev");
    });
    await mongoDbConnection();
  } catch (error: any) {
    console.log(error.message);
  }
})();
