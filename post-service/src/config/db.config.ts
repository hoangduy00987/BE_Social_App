import envConfig from "./env.config.js";

type DBConfigType = {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  [key: string]: any;
};

export class DBConfig {
  private constructor() {}

  public static getConfig(): DBConfigType {
    let config: DBConfigType = {
      host: envConfig.DB_HOST,
      port: envConfig.DB_PORT,
      user: envConfig.DB_USER,
      password: envConfig.DB_PASS,
      database: envConfig.DB_NAME,
    }
    if (envConfig.NODE_ENV === "production") {
      config = {
        ...config,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    }
    return config;
  }
}
