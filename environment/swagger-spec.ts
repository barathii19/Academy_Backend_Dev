import swaggerJsDocs from "swagger-jsdoc";

const swaggerDefinition = {
  info: {
    title: "Crud Academy Swagger Docs",
    version: "1.0.0",
    description: "All the APIs are listed here",
  },
  components: {},
  basepath: "http://3.110.169.152:8000/",
};
const options = {
  swaggerDefinition,
  apis: ["./swagger/*.ts", "./routes/*.ts"],
};
const swaggerSpec = swaggerJsDocs(options);

export default swaggerSpec;