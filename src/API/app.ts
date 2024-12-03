import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';
import path from 'path';
import { ServiceProvider } from '../Application/DependencyInjection';
import registerDevServices from '../Infrastructure/Dev/DependencyInjection';
import { registerRoutes } from '../API/Routes';

// Initialisation de Swagger JSDoc
const options = {
  definition: {
    openapi: '3.0.0', // Version de l'API OpenAPI
    info: {
      title: 'API Example', // Titre de l'API
      description: 'Documentation automatique de l\'API', // Description de l'API
      version: '1.0.0', // Version de l'API
    },
    servers: [
      {
        url: 'http://localhost:8080', // L'URL de l'API
      },
    ],
  },
  // Liste des fichiers de routes à analyser pour générer la documentation
  apis: [
    path.join(__dirname, 'Routes/hello.js'),  // Ajustez selon la structure de votre projet
    path.join(__dirname, 'Routes/index.js'), // Ajustez selon la structure de votre projet
  ],
};

console.log(__dirname);
// Générer la documentation Swagger en JSON
const swaggerSpec = swaggerJSDoc(options);

// Création de l'application Express
const app = express();
const port = 8080;

// Utilisation de Swagger UI pour exposer l'interface de documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Enregistrement des services
const services = new ServiceProvider();
registerDevServices(services);

// Enregistrement des routes
registerRoutes(app, services);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
