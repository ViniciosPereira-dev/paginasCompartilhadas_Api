import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Paginas Compartilhadas API",
            version: "1.0.0",
            description: `
            API do projeto Páginas Compartilhadas.

            Sistema desenvolvido para gerenciamento de doação e compartilhamento de livros entre usuários.

            Funcionalidades principais:
            - Cadastro e gerenciamento de usuários
            - Cadastro e gerenciamento de livros
            - Solicitações de interesse em livros
            - Controle de status das solicitações
            - Comunicação segura entre serviços utilizando API Key
            - Integração com microsserviço de recomendação de livros
            `
        },

        servers: [
            {
                url: "http://localhost:3000"
            }
        ],

        components: {
            securitySchemes: {
                apiKeyAuth: {
                    type: "apiKey",
                    in: "header",
                    name: "x-api-key"
                }
            }
        }
    },

    apis: ["./src/routes/*.js"]
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };