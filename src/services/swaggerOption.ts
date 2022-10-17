import swaggerJsdoc from "swagger-jsdoc";


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

const openapiSpecification = swaggerJsdoc(options);

export default openapiSpecification