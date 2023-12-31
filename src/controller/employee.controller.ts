import EmployeeService from "../service/employee.service";
import express, { NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import CreateEmployeeDto from "../dto/create-employee.dto";
import { validate } from "class-validator";
import UpdateEmployeeDto from "../dto/update-employee.dto";
import HttpExceptionHandle from "../exception/validation.exception";
import authenticate from "../middleware/authenticate.middleware";
import authorize from "../middleware/authorize.middleware";
import LoginDto from "../dto/login-dto";
import { Role } from "../utils/role.enum";
import PatchEmployeeDto from "../dto/patch-employee.dto";
import PatchAddressDto from "../dto/patch-employee-address.dto";
import logger from "../logging/winston.log";
import RequestWithUser from "../utils/RequestWithUser";

class EmployeeController {
    public router: express.Router;
    constructor(private employeeService: EmployeeService) {
        this.router = express.Router();
      this.router.get("/", authenticate, authorize([Role.DEVELOPER, Role.HR, Role.UI]), this.getAllEmployees);
        this.router.get("/:id", authenticate, authorize([Role.DEVELOPER, Role.HR, Role.UI]), this.getEmployeeByID);
        this.router.post("/", this.createAnEmployee);
       this.router.delete("/:id", authenticate, authorize([Role.HR]), this.deleteEmployee);

        this.router.put("/:id", authenticate, authorize([Role.DEVELOPER, Role.HR, Role.UI]), this.updateEmployee);
        this.router.patch("/:id", authenticate, authorize([Role.DEVELOPER, Role.HR, Role.UI]), this.patchEmployee);
        this.router.post("/login", this.loginEmployee);
    }

    public getAllEmployees = async (req: RequestWithUser, res: express.Response, next: NextFunction) => {
        console.log("getting data");
        let page = Number(req.query.page);
        if (!page) {
            page = 1;
        }
        let offset = Number(req.query.offset);
        if (!offset) {
            offset = 10;
        }
        const start = Number(req.startTime);
        const employees = await this.employeeService.getAllEmployees(page, offset);
        res.status(200).send({ data: employees.employeesWithDepartment, errors: null, message: "OK", meta: { length: employees.employeesWithDepartment.length, took: Date.now() - start, total: employees.count } });
    }

    public createAnEmployee = async (req: RequestWithUser, res: express.Response, next: NextFunction) => {
        const logStart = `[${req.traceId}] /employees${req.url} : ${req.method} :`;
        try {
            const createEmployeeDto = plainToInstance(CreateEmployeeDto, req.body);
            const errors = await validate(createEmployeeDto);
            if (errors.length > 0) {
                logger.warn(`${logStart} Create employee details validation errors `);
                throw new HttpExceptionHandle(400, "Validation Errors", errors);
            }
            const newEmployee = await this.employeeService.createAnEmployee(createEmployeeDto, logStart);
            logger.info(`${logStart} Creation of employee with username ${createEmployeeDto.name} successful `);
            const start = Number(req.startTime);
            logger.info(`${logStart} Request completed `);
            res.status(200).send({ data: newEmployee, errors: null, message: "OK", meta: { length: 1, took: Date.now() - start, total: 1 } });
        }
        catch (error) {
            next(error);
        }
    }

    public loginEmployee = async (req: RequestWithUser, res: express.Response, next: NextFunction) => {
        const logStart = `[${req.traceId}] /employees${req.url} : ${req.method} :`;
        try {
            const loginDto = plainToInstance(LoginDto, req.body);
            const errors = await validate(loginDto);
            if (errors.length > 0) {
                logger.warn(`${logStart} Login details validation errors `);
                throw new HttpExceptionHandle(400, "Validation Errors", errors);
            }
            const token = await this.employeeService.loginEmployee(loginDto, logStart);
            logger.info(`${logStart} Login successful `);
            const start = Number(req.startTime);
            logger.info(`${logStart} Request completed `);
            res.status(200).send({ data: token, errors: null, message: "OK", meta: { length: 1, took: Date.now() - start, total: 1 } });
        } catch (error) {
            next(error)
        }
    }

    public getEmployeeByID = async (req: RequestWithUser, res: express.Response, next: NextFunction) => {
        const logStart = `[${req.traceId}] /employees${req.url} : ${req.method} :`;
        try {
            const employeeid = Number(req.params.id);
            const employee = await this.employeeService.getEmployeeByID(employeeid, logStart);
            logger.info(`${logStart} Retrieval of details of employee with id ${employeeid} successful `);
            const start = Number(req.startTime);
            logger.info(`${logStart} Request completed `);
            res.status(200).send({ data: employee, errors: null, message: "OK", meta: { length: 1, took: Date.now() - start, total: 1 } });
        }
        catch (error) {
            next(error);
        }
    }

    public updateEmployee = async (req: RequestWithUser, res: express.Response, next: NextFunction) => {
        const logStart = `[${req.traceId}] /employees${req.url} : ${req.method} :`;
        try {
            const employeeid = Number(req.params.id);
            const employee = await this.employeeService.getEmployeeByID(employeeid, logStart);
            logger.info(`${logStart} Retrieval of details of employee with id ${employeeid} successful `);
            const updateEmployeeDto = plainToInstance(UpdateEmployeeDto, req.body);
            const errors = await validate(updateEmployeeDto);
            if (errors.length > 0) {
                logger.warn(`${logStart} Update employee details validation errors `);
                throw new HttpExceptionHandle(400, "Validation Errors", errors);
            }
                const updatedEmployee = await this.employeeService.updateEmployee(updateEmployeeDto, employee);
                logger.info(`${logStart}  Whole updation of details of employee with id ${employeeid} successful `);
                const start = Number(req.startTime);
                logger.info(`${logStart} Request completed `);
              res.status(200).send({ data: updatedEmployee, errors: null, message: "OK", meta: { length: 1, took: Date.now() - start, total: 1 } });
            
        }
        catch (error) {
            next(error);
        }
    }

    public patchEmployee = async (req: RequestWithUser, res: express.Response, next: NextFunction) => {
        const logStart = `[${req.traceId}] /employees${req.url} : ${req.method} :`;
        const patchEmployeeDto = plainToInstance(PatchEmployeeDto, req.body);
        const employeeid = Number(req.params.id);
        const employee = await this.employeeService.getEmployeeByID(employeeid, logStart);
        logger.info(`${logStart} Retrieval of details of employee with id ${employeeid} successful `);
        const errors = await validate(patchEmployeeDto);
        if (errors.length > 0) {
            logger.warn(`${logStart} Patch Employee details validation error`);
            throw new HttpExceptionHandle(400, "Validation Errors", errors);
        }
        await this.employeeService.assign(employee, patchEmployeeDto)
        const patchAddressDto = plainToInstance(PatchAddressDto, { ...req.body.address });
        const addressErrors = await validate(patchAddressDto);
        if (addressErrors.length > 0) {
            logger.warn(`${logStart} Patch Address details validation error`);
            throw new HttpExceptionHandle(400, "Validation Errors", errors);
        }
        await this.employeeService.assign(employee.address, patchAddressDto)
        logger.info(`${logStart} Updation of details of employee with id ${employeeid} successful `);
        const start = Number(req.startTime);
        logger.info(`${logStart} Request completed `);
        res.status(200).send({ data: employee, errors: null, message: "OK", meta: { length: 1, took: Date.now() - start, total: 1 } });
    }

    public deleteEmployee = async (req: RequestWithUser, res: express.Response, next: NextFunction) => {
        const logStart = `[${req.traceId}] /employees${req.url} : ${req.method} :`;
        try {
            const employeeid = Number(req.params.id);
            const employee = await this.employeeService.getEmployeeByID(employeeid, logStart);
            logger.info(`${logStart} Retrieval of details of employee with id ${employeeid} successful `);
            this.employeeService.deleteEmployee(employee);
            logger.info(`${logStart} Deletion of employee with id ${employeeid} successful `);
            const start = Number(req.startTime);
            logger.info(`${logStart} Request completed `);
            res.status(200).send("Employee deleted successfully");
        }
        catch (error) {
            next(error);
        }
    }
}

export default EmployeeController;