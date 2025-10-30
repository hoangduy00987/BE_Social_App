import { createApp } from './app.js';
import { env, assertEnv } from './shared/env.js';
import { logger } from './shared/logger.js';
import { createServer } from 'http';
import { setupWebSocket } from './realtime/websocket.js';

async function bootstrap() {
	try {
		assertEnv();
		const app = createApp();
		const httpServer = createServer(app);
		
		// Setup WebSocket
		const io = setupWebSocket(httpServer);
		
		const server = httpServer.listen(env.port, () => {
			logger.info({ port: env.port }, 'Notifications service listening');
		});

		// Start Kafka consumer in background
		import('./kafka/consumer.js').then(({ startConsumer }) => startConsumer().catch(err => {
			logger.error({ err }, 'Kafka consumer failed to start');
		}));

		process.on('SIGINT', () => {
			logger.info('Shutting down gracefully...');
			server.close(() => {
				io.close(() => {
					process.exit(0);
				});
			});
		});
	} catch (err) {
		logger.error({ err }, 'Failed to bootstrap');
		process.exit(1);
	}
}

bootstrap();
