import express, { NextFunction } from "express"
import DepartmentService from "../service/department.service";
import HttpExceptionHandle from "../exception/validation.exception";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import LoginDto from "../dto/login-dto";
import CreateDepartmentDto from "../dto/create-department.dto";
import UpdateDepartmentDto from "../dto/update-department.dto";
//import authorize from "../middleware/authorize.middleware";
import { Role } from "../utils/role.enum";
import authorize from "../middleware/authorize.middleware";
import authenticate from "../middleware/authenticate.middleware";

class DepartmentController {
    public router: express.Router;
    constructor(private departmentService: DepartmentService) {
        this.router = express.Router();
        this.router.get("/",authenticate,authorize([Role.DEVELOPER,Role.HR,Role.UI]), this.getAllDepartments)
        this.router.post("/",authenticate,authorize([Role.HR]), this.createDepartment)

        this.router.get("/:id",authenticate,authorize([Role.DEVELOPER,Role.HR,Role.UI]), this.getDepartmentById)
        this.router.delete("/:id",authenticate,authorize([Role.HR]), this.deleteDepartment);

        this.router.put("/:id",authenticate,authorize([Role.HR]), this.updateDepartment);
        

    }
    public createDepartment= async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const createDepartmentDto = plainToInstance(CreateDepartmentDto, req.body);
            console.log(createDepartmentDto);
            const errors = await validate(createDepartmentDto);
            if (errors.length > 0) {
                console.log(errors);
                throw new HttpExceptionHandle(400, "Validation Errors", errors);
            }
            else {
                const savedDepartment = await this.departmentService.createDepartment(createDepartmentDto);
                res.status(200).send({data:savedDepartment,errors:null,message:"OK",meta:{length:1,total:1}});
            }
        }
        catch (error) {
            next(error);
        }
    }

    public getAllDepartments = async (req: express.Request, res: express.Response) => {


        const departments = await this.departmentService.getAllDepartment();
        res.status(200).send({data:departments,errors:null,message:"OK",meta:{length:departments.length,total:departments.length}});
    }

    public getDepartmentById = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            const department = await this.departmentService.getDepartmentByID(id);
            res.status(200).send({data:department,errors:null,message:"OK",meta:{length:1,total:1}});
        }
        catch (error) {
            next(error);
        }

    }

    public deleteDepartment = async (req: express.Request, res: express.Response, next: NextFunction) => {

        try {
            const departmentid = Number(req.params.id);
            const department = await this.departmentService.getDepartmentByID(departmentid);
            console.log(department);
            const deletedDepartment= await this.departmentService.deleteDepartment(department);
            res.status(200).send({data:deletedDepartment,errors:null,message:"OK",meta:{length:1,total:1}});
        }
        catch (error) {
            next(error);
        }

    }
    public updateDepartment = async (req: express.Request, res: express.Response, next: NextFunction) => {

        try {
            const departmentid = Number(req.params.id);
            const department = await this.departmentService.getDepartmentByID(departmentid);
            console.log(department);
            const updateDepartmentDto = plainToInstance(UpdateDepartmentDto, req.body);
            const errors = await validate(updateDepartmentDto);
            if (errors.length > 0) {
                throw new HttpExceptionHandle(400, "Validation Errors", errors);
            }
            else {
                const updatedDepartment = await this.departmentService.updateDepartment(updateDepartmentDto,department);
                res.status(200).send({data:updatedDepartment,errors:null,message:"OK",meta:{length:1,total:1}});
            }
        }
        catch (error) {
            next(error);
        }

    }


}

export default DepartmentController;
