import express, { Application } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import mongoDbConnection from "./database/mongoDB";
import requestHeaders from "./middleware/requestHeaders";
import errorHandler from "./middleware/requestErrorHandle";
import { pageNotFound } from "./middleware/404Page";
import v1Api from "./services/v1Apis";
import openapiSpecification from "./services/swaggerOption";
dotenv.config();

const app: Application = express();

// convert request to json using express middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// active cors policy for client accessibility
app.use(cors());

// client request headers
app.use(requestHeaders);

// api documentation server
app.use(
  "/api/v1/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(openapiSpecification)
);

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
    });
    await mongoDbConnection();
  } catch (error: any) {
    console.log(error.message);
  }
})();
