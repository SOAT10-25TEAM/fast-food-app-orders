import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Grupo 25",
      version: "1.0.0",
      description: "Documentação da API do quarto desafio",
    },
    servers: [
      {
        url: "http://localhost:3002/fastfood-orders-api",
      },
    ],
  },
  apis: [
    "./src/Order/routes/*.ts",
  ],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

export { swaggerSpecs };
