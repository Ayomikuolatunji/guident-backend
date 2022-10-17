"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const v1Api = express_1.default.Router();
const v1routes_route_1 = __importDefault(require("../routes/v1routes.route"));
v1Api.use("/v1", v1routes_route_1.default);
exports.default = v1Api;
