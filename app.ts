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




import express from "express";

import {employeeRouter} from "./employee_router";
import loggerMiddleware from "./loggerMiddleware";

const server = express();
server.use(express.json());
server.use(loggerMiddleware);

server.use("/employees", employeeRouter);

server.get('/', (req, res) => {
    console.log("at /");
    res.status(200).send("hello world typescript");
})



server.listen(3000, () => {
    console.log("server is listening to port 3000");
})



