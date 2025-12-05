import app from "./app.js";
import envConfig from "./config/env.config.js";
import { initKafkaProducer } from "./lib/kafkaClient.js";

const PORT = envConfig.PORT;

app.listen(PORT, async () => {
  await initKafkaProducer();
  console.log(`Post Service running on port ${PORT}`);
});
