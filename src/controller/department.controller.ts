import express, { NextFunction } from "express"
import DepartmentService from "../service/department.service";
import HttpExceptionHandle from "../exception/validation.exception";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import CreateDepartmentDto from "../dto/create-department.dto";
import UpdateDepartmentDto from "../dto/update-department.dto";
import { Role } from "../utils/role.enum";
import authorize from "../middleware/authorize.middleware";
import authenticate from "../middleware/authenticate.middleware";
import RequestWithUser from "../utils/RequestWithUser";
import logger from "../logging/winston.log";

class DepartmentController {
    public router: express.Router;
    constructor(private departmentService: DepartmentService) {
        this.router = express.Router();
        this.router.get("/", authenticate, authorize([Role.DEVELOPER, Role.HR, Role.UI]), this.getAllDepartments)
       this.router.post("/", authenticate, authorize([Role.HR]), this.createDepartment)

        this.router.get("/:id", authenticate, authorize([Role.DEVELOPER, Role.HR, Role.UI]), this.getDepartmentById)
        this.router.delete("/:id", authenticate, authorize([Role.HR]), this.deleteDepartment);
        this.router.put("/:id", authenticate, authorize([Role.HR]), this.updateDepartment);
    }

    public createDepartment = async (req: RequestWithUser, res: express.Response, next: NextFunction) => {
        const logStart = `[${req.traceId}] /departments${req.url} : ${req.method} :`;
        try {
            const createDepartmentDto = plainToInstance(CreateDepartmentDto, req.body);
            const errors = await validate(createDepartmentDto);
            if (errors.length > 0) {
                logger.warn(`${logStart} Create department details  validation errors"`);
                throw new HttpExceptionHandle(400, "Validation Errors", errors);
            }
            const savedDepartment = await this.departmentService.createDepartment(createDepartmentDto);
            logger.info(`${logStart} Depaartment with name ${createDepartmentDto.name} created succesfully `);
            const start = Number(req.startTime);
            logger.info(`${logStart} Request completed `);
            res.status(200).send({ data: savedDepartment, errors: null, message: "OK", meta: { length: 1, took: Date.now() - start, total: 1 } });
        }
        catch (error) {
            next(error);
        }
    }

    public getAllDepartments = async (req: RequestWithUser, res: express.Response) => {
        const logStart = `[${req.traceId}] /departments${req.url} : ${req.method} :`;
        const departments = await this.departmentService.getAllDepartments();
        logger.info(`${logStart} All department details  retrieved successfully`);
        const start = Number(req.startTime);
        logger.info(`${logStart} Request completed `);
        res.status(200).send({ data: departments, errors: null, message: "OK", meta: { length: departments.length, took: Date.now() - start, total: departments.length } });
    }

    public getDepartmentById = async (req: RequestWithUser, res: express.Response, next: NextFunction) => {
        const start = Number(req.startTime);
        const logStart = `[${req.traceId}] /departments${req.url} : ${req.method} :`;
        try {
            const id = Number(req.params.id);
            const department = await this.departmentService.getDepartmentByID(id, logStart);
            logger.info(`${logStart} Retrieval of department with id ${id} successful `);
            logger.info(`${logStart} Request completed `);
            res.status(200).send({ data: department, errors: null, message: "OK", meta: { length: 1, took: Date.now() - start, total: 1 } });
        }
        catch (error) {
            next(error);
        }
    }

    public deleteDepartment = async (req: RequestWithUser, res: express.Response, next: NextFunction) => {
        const start = Number(req.startTime);
        const logStart = `[${req.traceId}] /departments${req.url} : ${req.method} :`;
        try {
            const departmentid = Number(req.params.id);
            const department = await this.departmentService.getDepartmentByID(departmentid, logStart);
            logger.info(`${logStart} Retrieval of department with id ${departmentid} successful `);
            const deletedDepartment = await this.departmentService.deleteDepartment(department, logStart);
            logger.info(`${logStart} Deletion of department with id ${departmentid} successful `);
            logger.info(`${logStart} Request completed `);
            res.status(200).send({ data: deletedDepartment, errors: null, message: "OK", meta: { length: 1, took: Date.now() - start, total: 1 } });
        }
        catch (error) {
            next(error);
        }
    }

    public updateDepartment = async (req: RequestWithUser, res: express.Response, next: NextFunction) => {
        const start = Number(req.startTime);
        const logStart = `[${req.traceId}] /departments${req.url} : ${req.method} :`;
        try {
            const departmentid = Number(req.params.id);
            const department = await this.departmentService.getDepartmentByID(departmentid, logStart);
            logger.info(`${logStart} Retrieval of department with id ${departmentid} successful `);
            const updateDepartmentDto = plainToInstance(UpdateDepartmentDto, req.body);
            const errors = await validate(updateDepartmentDto);
            if (errors.length > 0) {
                logger.warn(`${logStart} Update department details  validation errors"`);
                throw new HttpExceptionHandle(400, "Validation Errors", errors);
            }
            else {
                const updatedDepartment = await this.departmentService.updateDepartment(updateDepartmentDto, department);
                logger.info(`${logStart} Updation of department with id ${departmentid} successful `);
                const start = Number(req.startTime);
                logger.info(`${logStart} Request completed `);
                res.status(200).send({ data: updatedDepartment, errors: null, message: "OK", meta: { length: 1, took: Date.now() - start, total: 1 } });
            }
        }
        catch (error) {
            next(error);
        }
    }
}

export default DepartmentController;
