import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { BusinessError, DatabaseError } from "../../utils/errors";
import { z } from "zod";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof BusinessError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
      },
    });
  } else if (err instanceof DatabaseError) {
    res.status(500).json({
      error: {
        message: "Erro no banco de dados",
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      },
    });
  } else if (err instanceof z.ZodError) {
    res.status(400).json({
      error: {
        message: "Erro de validação",
        details: err.errors,
      },
    });
  } else {
    res.status(500).json({
      error: {
        message: "Erro interno do servidor",
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      },
    });
  }

  next();
};
