import "reflect-metadata";
import { ExpressServer } from "./api";
import { AppDataSource } from "./external/typeORM/config";
import { TypeORMConnection } from "./external/typeORM/connection";

import "dotenv/config";

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Data base running...");

    // await AppDataSource.runMigrations();
    // console.log("Migaration ok...");

    const dbConnection = new TypeORMConnection();

    const server = new ExpressServer(dbConnection);
    server.registerRoutes();

    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    await server.start(port);
  } catch (error) {
    console.error("Error during application initialization:", error);
    process.exit(1);
  }
}

main();
