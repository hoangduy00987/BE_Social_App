import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notifications Service API',
      version: '1.0.0',
      description: 'Microservice phụ trách thông báo theo mô hình event-driven',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string' },
            type: { type: 'string' },
            title: { type: 'string' },
            body: { type: 'string' },
            metadata: { type: 'object' },
            isRead: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        UserPreference: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            inApp: { type: 'boolean' },
            email: { type: 'boolean' },
            push: { type: 'boolean' },
            types: { type: 'object' },
            quietHours: { type: 'object' },
            language: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./src/controllers/*.ts'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Notifications Service API'
  }));
}
