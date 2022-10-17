import express from "express"

const v1Api = express.Router()

import schoolRouter from "../routes/v1routes.route"

v1Api.use("/v1", schoolRouter)


export default v1Api