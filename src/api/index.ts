import { HTTPServer } from "../interfaces/HTTPServer";
import express, { Express } from "express";
import { swaggerRouter } from "./middlewares/swaggerMiddleware";
import { DBConnection } from "../interfaces/DBConnection";
import { userRoutes } from "../User/routes";
import { productRoutes } from "../Product/routes";
import { orderRoutes } from "../Order/routes";
import { errorHandler } from "./middlewares/errorHandler";

export class ExpressServer implements HTTPServer {
  private app: Express;
  private dbConnection: DBConnection<any>;

  constructor(dbConnection: DBConnection<any>) {
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    this.dbConnection = dbConnection;
  }

  registerRoutes(): void {
    this.app.use("/soat-api", userRoutes(this.dbConnection));
    this.app.use("/soat-api", productRoutes(this.dbConnection));
    this.app.use("/soat-api", orderRoutes(this.dbConnection));

    this.app.use(swaggerRouter);

    this.app.use(errorHandler);
  }

  async start(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.app
        .listen(port, () => {
          console.log(`Server is running on http://localhost:${port}`);
          console.log(
            `Swagger docs available at http://localhost:${port}/api-docs`
          );
          resolve();
        })
        .on("error", reject);
    });
  }
}
