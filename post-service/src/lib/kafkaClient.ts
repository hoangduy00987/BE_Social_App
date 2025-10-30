import { Kafka } from "kafkajs";
import envConfig from "../config/env.config";

const kafka = new Kafka({
  clientId: "post-service",
  brokers: [envConfig.KAFKA_BROKER],
});

export const producer = kafka.producer();

export async function initKafkaProducer() {
  await producer.connect();
  console.log("Kafka Producer connected (Post Service)");
}
