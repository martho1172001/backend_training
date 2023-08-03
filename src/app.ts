// import { Calculator } from "./calculator";
// const myCalculator = new Calculator;

// myCalculator.add(200,3);
// myCalculator.subtract(200,3);
// myCalculator.multiply(200,3);
// myCalculator.divide(200,3);
// myCalculator.power(21,3);
// myCalculator.factorial(12);
// myCalculator.modulus(200,3);
// myCalculator.percentage(20,3);



import "reflect-metadata"
import express, { NextFunction, Request, Response } from "express";

import employeeRouter from "./route/employee.route";
import loggerMiddleware from "./middleware/logger.middleware";
import dataSource from "./db/postgress.db";
import HttpException from "./exception/http.exception";
import errorMiddleware from "./middleware/error.middleware";

const server = express();
server.use(express.json());
server.use(loggerMiddleware);

server.use("/employees", employeeRouter);

server.get('/', (req, res) => {
    console.log("at /");
    res.status(200).send("hello world typescript");
});

server.use(errorMiddleware);



(async()=>{
    await dataSource.initialize();
    server.listen(3000, () => {
        console.log("server is listening to port 3000");
    });
})();





