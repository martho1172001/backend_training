import { NextFunction, Response } from "express";
import RequestWithUser from "../utils/RequestWithUser";
import logger from "../logging/winston.log";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import HttpExceptionHandle from "../exception/validation.exception";

const validateInput = (Dto,logStart)=> async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const dto= plainToInstance(Dto, req.body);
        const errors = await validate(Dto);
        if (errors.length > 0) {
            logger.warn(`${logStart} Login details validation errors `);
            throw new HttpExceptionHandle(400, "Validation Errors", errors);
        }
        return dto
      next();
    } catch (error) {
      next(error);
    }
  };
  
  export default validateInput;