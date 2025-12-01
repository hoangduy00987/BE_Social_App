import dotenv from 'dotenv';

dotenv.config();

function getNumber(value: string | undefined, fallback: number): number {
	const n = Number(value);
	return Number.isFinite(n) ? n : fallback;
}

export const env = {
	port: getNumber(process.env.PORT, 3000),
	nodeEnv: process.env.NODE_ENV ?? 'development',
	databaseUrl: process.env.DATABASE_URL ?? '',
	jwt: {
		accessSecret: process.env.ACCESS_SECRET ?? '',
	},
	kafka: {
		brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(',').map(s => s.trim()).filter(Boolean),
		clientId: process.env.KAFKA_CLIENT_ID ?? 'notifications-service',
		groupId: process.env.KAFKA_GROUP_ID ?? 'notifications-consumers'
	},
	corsOrigins: (process.env.CORS_ORIGINS ?? '').split(',').map(s => s.trim()).filter(Boolean)
} as const;

export function assertEnv() {
	if (!env.databaseUrl) {
		throw new Error('DATABASE_URL is required');
	}
	if (!env.jwt.accessSecret) {
		throw new Error('ACCESS_SECRET is required for JWT verification');
	}
}
