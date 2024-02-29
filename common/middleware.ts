import { Request, Response, NextFunction } from "express";
export class MiddleWare {
  static loggerMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    console.log(
      `LOG: ${request.originalUrl} called on at ${Date().toString()}`
    );
    next();
  }
}
