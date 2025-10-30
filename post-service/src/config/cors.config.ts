import { CorsOptions } from "cors";
import envConfig from "./env.config";

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || envConfig.CORS_ALLOWED_ORIGIN.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

export default corsOptions;
