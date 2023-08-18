import { NextFunction, Response } from "express"
import logger from "../logging/winston.log";
import RequestWithUser from "../utils/RequestWithUser";
import { v4 as uuidv4 } from 'uuid';

const loggerMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Headers', '*')
    req.startTime=Date.now();
    req.traceId =uuidv4(); 
    logger.info(`[${req.traceId}] ${req.url} : ${req.method} : New Request `);
    next();
}

export default loggerMiddleware;