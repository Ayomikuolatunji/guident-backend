import express from "express";

const v1Api = express.Router();

import schoolRouter from "../routes/school.route";
import studentParentRouter from "../routes/students.route";

v1Api.use("/v1", schoolRouter);
v1Api.use("/v1", studentParentRouter);

export default v1Api;
