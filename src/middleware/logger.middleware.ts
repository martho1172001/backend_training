import { NextFunction, Request, Response } from "express"
import logger from "../logging/winston.log";
import RequestWithUser from "../utils/RequestWithUser";

import { v4 as uuidv4 } from 'uuid';

const loggerMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
    req.startTime=Date.now();
    req.traceId =uuidv4(); // If the traceId is not present in headers, generate and set it
    logger.info(`[${req.traceId}] ${req.url} : ${req.method} : New Request `);
    //console.log(`${new Date()} : ${req.url} : ${req.method} `);   
    next();
}

export default loggerMiddleware;