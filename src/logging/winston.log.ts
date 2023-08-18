import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';



const logFormat = winston.format.printf(({ level, message,traceId, label, timestamp}) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});


const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.label({ label: 'KV_EmployeePortal' }),
    winston.format.timestamp(),

    logFormat
  ),
  transports: [
    new winston.transports.Console(), 
    new winston.transports.File({
      filename: './src/logging/application.log',
    }), 
  ],
});


logger.transports.forEach((transport) => {
  transport.level = 'debug'; 
});

export default logger;
