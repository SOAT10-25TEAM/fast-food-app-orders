import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Grupo 67",
      version: "1.0.0",
      description: "Documentação da API do segundo desafio",
    },
    servers: [
      {
        url: "http://localhost:3002/soat-api",
      },
    ],
  },
  apis: [
    "./src/User/routes/*.ts",
    "./src/Product/routes/*.ts",
    "./src/Order/routes/*.ts",
  ],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

export { swaggerSpecs };
