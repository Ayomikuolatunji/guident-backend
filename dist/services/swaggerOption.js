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
            description: "Api hub and store for guident services",
        },
        servers: [
            {
                url: process.env.SWAGGER_SERVER,
            },
        ],
    },
    apis: ["./src/routes/*.ts"], // files containing annotations as above
};
const openapiSpecification = (0, swagger_jsdoc_1.default)(options);
exports.default = openapiSpecification;
