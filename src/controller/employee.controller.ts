import Employee from "../entity/employee.entity";
import EmployeeService from "../service/employee.service";
import express, { NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import CreateEmployeeDto from "../dto/create-employee.dto";
import { validate } from "class-validator";
import UpdateEmployeeDto from "../dto/update-employee.dto";
import HttpException from "../exception/http.exception";
import HttpExceptionHandle from "../exception/validation.exception";
import authenticate from "../middleware/authenticate.middleware";
import authorize from "../middleware/authorize.middleware";
import LoginDto from "../dto/login-dto";
import { Role } from "../utils/role.enum";
import PatchEmployeeDto from "../dto/patch-employee.dto";
import PatchAddressDto from "../dto/patch-employee-address.dto";
import employeeRepository from "../repository/employee.repository";
import logger from "../logging/winston.log";
import RequestWithUser from "../utils/RequestWithUser";

class EmployeeController {

    public router: express.Router;
    constructor(private employeeService: EmployeeService) {
        this.router = express.Router();

        this.router.get("/",authenticate, authorize([Role.DEVELOPER, Role.HR, Role.UI]), this.getAllEmployees);
        this.router.get("/:id", authenticate, authorize([Role.DEVELOPER, Role.HR, Role.UI]) ,this.getEmployeeByID);
        this.router.post("/", authenticate, authorize([Role.HR]), this.createAnEmployee);

        this.router.delete("/:id", authenticate, authorize([Role.HR]), this.deleteEmployee);
        this.router.put("/:id", authenticate, authorize([Role.DEVELOPER, Role.HR, Role.UI]), this.updateEmployee);
        this.router.patch("/:id", authenticate, authorize([Role.DEVELOPER, Role.HR, Role.UI]), this.patchEmployee);

        this.router.post("/login", this.loginEmployee);



    }


    public createAnEmployee = async (req: RequestWithUser, res: express.Response, next: NextFunction) => {
        try {
            const createEmployeeDto = plainToInstance(CreateEmployeeDto, req.body);
            console.log(createEmployeeDto);
            const errors = await validate(createEmployeeDto);
            if (errors.length > 0) {
                console.log(errors);
                throw new HttpExceptionHandle(400, "Validation Errors", errors);
            }
            else {


                const savedEmployee = await this.employeeService.createAnEmployee(createEmployeeDto);

                //const employee = await this.employeeService.getAllEmployee(employeeid);
                const start= Number(req.startTime); 
        const logStart = `[${req.traceId}] /employees${req.url} : ${req.method} :`;
                logger.info(`${logStart} Request completed `);
                res.status(200).send({ data: savedEmployee, errors: null, message: "OK", meta: { length: 1,took: Date.now()-start,  total: 1 } });
            }
        }
        catch (error) {
            next(error);
        }
    }


    public loginEmployee = async (req: RequestWithUser, res: express.Response, next: NextFunction) => {

        try {
            const loginDto = plainToInstance(LoginDto, req.body);
            console.log(loginDto);
            const errors = await validate(loginDto);
            if (errors.length > 0) {
                console.log(errors);
                throw new HttpExceptionHandle(400, "Validation Errors", errors);
            } else {
                const token = await this.employeeService.loginEmployee(loginDto);
                const start= Number(req.startTime);
                const logStart = `[${req.traceId}] /employees${req.url} : ${req.method} :`;
                logger.info(`${logStart} Request completed `);
                res.status(200).send({ data: token, errors: null, message: "OK", meta: { length: 1,took: Date.now()-start,  total: 1 } });
            }

        } catch (error) {
            next(error)
        }

    }
    public getAllEmployees = async (req:RequestWithUser, res: express.Response) => {
        const employees = await this.employeeService.getAllEmployee();
        const start= Number(req.startTime);
        const logStart = `[${req.traceId}] /employees${req.url} : ${req.method} :`;
                logger.info(`${logStart} Request completed `);
        
        res.status(200).send({ data: employees, errors: null, message: "OK", meta: { length: employees.length,took: Date.now()-start, total: employees.length } });
        

    }

    public getEmployeeByID = async (req: RequestWithUser, res: express.Response, next: NextFunction) => {
        try {
            const employeeid = Number(req.params.id);
            const employee = await this.employeeService.getEmployeeByID(employeeid);
            const start= Number(req.startTime);
        const logStart = `[${req.traceId}] /employees${req.url} : ${req.method} :`;
                logger.info(`${logStart} Request completed `);
            res.status(200).send({ data: employee, errors: null, message: "OK", meta: { length: 1,took: Date.now()-start,  total: 1 } });
        }
        catch (error) {
            next(error);
        }

    }
    public updateEmployee = async (req:RequestWithUser, res: express.Response, next: NextFunction) => {

        try {
            const employeeid = Number(req.params.id);
            const employee = await this.employeeService.getEmployeeByID(employeeid);
            console.log(employee);
            const updateEmployeeDto = plainToInstance(UpdateEmployeeDto, req.body);
            const errors = await validate(updateEmployeeDto);
            if (errors.length > 0) {
                throw new HttpExceptionHandle(400, "Validation Errors", errors);
            }
            else {
                const updatedEmployee = await this.employeeService.updateEmployee(updateEmployeeDto, employee);
                const start= Number(req.startTime);
        const logStart = `[${req.traceId}] /employees${req.url} : ${req.method} :`;
                logger.info(`${logStart} Request completed `);
                res.status(200).send({ data: updatedEmployee, errors: null, message: "OK", meta: { length: 1, took: Date.now()-start, total: 1 } });
            }
        }
        catch (error) {
            next(error);
        }

    }


    public patchEmployee = async (req: RequestWithUser, res: express.Response, next: NextFunction) => {
        const patchEmployeeDto = plainToInstance(PatchEmployeeDto, req.body);
        const employeeid = Number(req.params.id);
        const employee = await this.employeeService.getEmployeeByID(employeeid);
        console.log(employee);
        const errors = await validate(patchEmployeeDto);
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Employee validation error', errors });
        }
        await this.employeeService.assign(employee, patchEmployeeDto)

        const patchAddressDto = plainToInstance(PatchAddressDto, { ...req.body.address });
     
        const addressErrors = await validate(patchAddressDto);

        if (addressErrors.length > 0) {
            return res.status(400).json({ message: 'Address validation error', errors: addressErrors });
        }
        await this.employeeService.assign(employee.address, patchAddressDto)
        const start= Number(req.startTime);
        const logStart = `[${req.traceId}] /employees${req.url} : ${req.method} :`;
                logger.info(`${logStart} Request completed `);
        res.status(200).send({ data: employee, errors: null, message: "OK", meta: { length: 1,took: Date.now()-start,  total: 1 } });
    }


    public deleteEmployee = async (req: RequestWithUser, res: express.Response, next: NextFunction) => {

        try {
            const employeeid = Number(req.params.id);
            const employee = await this.employeeService.getEmployeeByID(employeeid);
            console.log(employee);
            await this.employeeService.deleteEmployee(employee);
            const start= Number(req.startTime);
        const logStart = `[${req.traceId}] /employees${req.url} : ${req.method} :`;
                logger.info(`${logStart} Request completed `);
            res.status(200).send("employee deleted successfully");
        }
        catch (error) {
            next(error);
        }

    }




}


export default EmployeeController;