import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

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

const openapiSpecification = swaggerJsdoc(options);

export default openapiSpecification;
