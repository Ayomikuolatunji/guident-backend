"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const v1Api = express_1.default.Router();
const school_route_1 = __importDefault(require("../routes/school.route"));
const students_route_1 = __importDefault(require("../routes/students.route"));
v1Api.use("/v1", school_route_1.default);
v1Api.use("/v1", students_route_1.default);
exports.default = v1Api;
