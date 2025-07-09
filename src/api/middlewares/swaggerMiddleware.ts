import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpecs } from "../config/swagger";

const swaggerRouter = Router();

swaggerRouter.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

export { swaggerRouter };
