"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
// swagger UI
const options = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Guident API Documentation",
            version: "1.0.0",
            description: "V1 API's for guident services",
        },
        servers: [
            {
                url: `${process.env.SWAGGER_SERVER}/api/v1`,
            },
        ],
    },
    apis: ["./src/routes/*.ts"],
};
const openapiSpecification = (0, swagger_jsdoc_1.default)(options);
exports.default = openapiSpecification;
