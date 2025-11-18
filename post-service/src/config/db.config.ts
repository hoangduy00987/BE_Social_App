import envConfig from "./env.config.js";

export class DBConfig {
  private constructor() {}

  public static getConfig() {
    return {
      host: envConfig.DB_HOST,
      port: envConfig.DB_PORT,
      user: envConfig.DB_USER,
      password: envConfig.DB_PASS,
      database: envConfig.DB_NAME,
    };
  }
}
