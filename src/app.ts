import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/.env' });

import "reflect-metadata"
import express from "express";

import employeeRouter from "./route/employee.route";
import loggerMiddleware from "./middleware/logger.middleware";
import dataSource from "./db/postgress.db";
import errorMiddleware from "./middleware/error.middleware";
import { departmentRouter } from "./route/department.route";
import roleRouter from "./route/role.route";
import logger from "./logging/winston.log";
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');
const server = express();
server.use(express.json());
server.use(loggerMiddleware);
const corsOptions = {
    origin: 'http://localhost:3000',
  };
  
  server.use(cors(corsOptions));
  
server.use("/employees", employeeRouter);
server.use("/departments", departmentRouter);
server.use("/roles", roleRouter)

server.get('/', (req, res) => {
    console.log("at /");
    res.status(200).send("hello world typescript");
});

server.use(errorMiddleware);

(async () => {
    try {
        await dataSource.initialize();
        server.listen(4000, () => {
            console.log("server is listening to port 4000");
        });
    } catch {
        logger.error(`Server down!!`);

    }
})();
