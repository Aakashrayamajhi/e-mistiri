import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Mistiri API",
      version: "1.0.0",
      description: "API documentation for E-Mistiri platform",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 6000}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [
    "./modules/**/*.js", 
  ],
};

export const swaggerSpec = swaggerJSDoc(options);