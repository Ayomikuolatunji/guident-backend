const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;
import express, { Application } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";

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

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on(
    "exit",
    (worker: { process: { pid: any } }, code: any, signal: any) => {
      console.log(`worker ${worker.process.pid} died`);
    }
  );
} else {
  console.log(`Worker ${process.pid} started`);
  app.get("/cluster", (req, res) => {
    let worker = cluster.worker.id;
    res.send(`Running on worker with id ==> ${worker}`);
  });
  // connecting server
  (async function startConnection() {
    try {
      app.listen(process.env.PORT! || 8000, () => {
        console.log(`App running on port ${process.env.PORT}`);
        logger.info(`Server started and running on  ${process.env.PORT}`);
      });
      await mongoDbConnection();
    } catch (error: any) {
      console.log(error.message);
    }
  })();
}
