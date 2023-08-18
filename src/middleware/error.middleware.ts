import { NextFunction, Request, Response } from "express";
import HttpException from "../exception/http.exception";
import HttpExceptionHandle from "../exception/validation.exception";

const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
    try {
        if (error instanceof HttpExceptionHandle) {
            res.status(error.status).send({ message: error.message, error: error.formatValidationError(error.errors) });
            return;
        } else {
            if (error instanceof HttpException) {
                res.status(error.status).send({ error: error.message })
                return;
            }
            else {
                res.status(500).send({ error: error.message });
            }
        }
    } catch (err) {
        next(err);
    }
}
export default errorMiddleware;