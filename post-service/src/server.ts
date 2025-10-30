import app from "./app";
import envConfig from "./config/env.config";
// import { initKafkaProducer } from "./lib/kafkaClient";

const PORT = envConfig.PORT;

app.listen(PORT, async () => {
  // await initKafkaProducer();
  console.log(`Post Service running on port ${PORT}`);
});
