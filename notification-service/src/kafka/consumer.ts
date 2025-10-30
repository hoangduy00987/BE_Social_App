import { Kafka, logLevel } from 'kafkajs';
import { env } from '../shared/env.js';
import { logger } from '../shared/logger.js';
import { routeEvent } from './router.js';

const kafka = new Kafka({
	clientId: env.kafka.clientId,
	brokers: env.kafka.brokers,
	logLevel: logLevel.NOTHING
});

export async function startConsumer() {
	const consumer = kafka.consumer({ groupId: env.kafka.groupId });
	await consumer.connect();

	const topics = [
		'post.comment-created.v1',
		'post.post-created.v1'
	];

	for (const topic of topics) {
		await consumer.subscribe({ topic, fromBeginning: false });
	}

	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			try {
				const value = message.value?.toString();
				if (!value) return;
				const evt = JSON.parse(value);
				await routeEvent(evt);
			} catch (err) {
				logger.error({ err }, 'Error handling Kafka message');
			}
		}
	});

	logger.info({ topics }, 'Kafka consumer started');
}
