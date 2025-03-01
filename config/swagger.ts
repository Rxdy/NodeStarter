import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Titre",
            version: "1.0.0",
            description: "Documentation de l'API ",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Description",
            },
        ],
    },
    apis: ["src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
