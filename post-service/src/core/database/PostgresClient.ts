import { Pool } from "pg";
import { DBConfig } from "../../config/db.config";

export class PostgresClient {
  private static instance: Pool;

  private constructor() {}

  public static getInstance(): Pool {
    if (!PostgresClient.instance) {
      PostgresClient.instance = new Pool(DBConfig.getConfig());
      console.log("PostgreSQL connected");
    }
    return PostgresClient.instance;
  }
}
