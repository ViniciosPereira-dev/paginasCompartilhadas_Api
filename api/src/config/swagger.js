import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Livros e Doações",
      version: "1.0.0",
      description: "Documentação da API com suporte a autenticação JWT",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Insira o token JWT retornado no login para liberar as rotas.",
        },
        apiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], 
};

export const specs = swaggerJSDoc(swaggerOptions);
