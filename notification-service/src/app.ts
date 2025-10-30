import express from 'express';
import cors from 'cors';
import { env } from './shared/env.js';
import { createRoutes } from './http/routes.js';
import { setupSwagger } from './swagger/swagger.js';

export function createApp() {
	const app = express();

	const corsOrigins = env.corsOrigins.length > 0 ? env.corsOrigins : undefined;
	app.use(cors({ origin: corsOrigins ?? true }));
	app.use(express.json());

	// Setup Swagger documentation
	setupSwagger(app);

	app.use(createRoutes());

	return app;
}
