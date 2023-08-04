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

class EmployeeController {

    public router: express.Router;
    constructor(private employeeService: EmployeeService) {
        this.router = express.Router();

        this.router.get("/",authenticate,this.getAllEmployees);
        this.router.get("/:id", this.getEmployeeByID);
        this.router.post("/", authenticate,authorize, this.createAnEmployee);

        this.router.delete("/:id", this.deleteEmployee);
        this.router.put("/:id", this.updateEmployee);
        this.router.post("/login",this.loginEmployee);



    }


    public createAnEmployee = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const name = req.body.name;
            const age = req.body.age;
            const email = req.body.email;
            const address = req.body.address;
            const role = req.body.role;
            const password: string = req.body.password;

            const createEmployeeDto = plainToInstance(CreateEmployeeDto, req.body);
            const errors = await validate(createEmployeeDto);


            if (errors.length > 0) {
                console.log(errors);
                throw new HttpExceptionHandle(400, "Validation Errors", errors);


            }
            else {
                const savedEmployee = await this.employeeService.createAnEmployee(createEmployeeDto);
                res.status(200).send(savedEmployee);
            }
        }
        catch (error) {
            next(error);
        }



    }
    getAllEmployees = async (req: express.Request, res: express.Response) => {
        const employees = await this.employeeService.getAllEmployee();
        res.status(200).send(employees);
    }
    public getEmployeeByID = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const employeeid = Number(req.params.id);
            const employee = await this.employeeService.getEmployeeByID(employeeid);
            console.log(employee);
            res.status(200).send(employee);
        }
        catch (error) {
            next(error);
        }

    }
    public updateEmployee = async (req: express.Request, res: express.Response, next: NextFunction) => {

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
                const updatedEmployee = await this.employeeService.updateEmployee(updateEmployeeDto,employee);
                res.status(200).send(updatedEmployee);
            }
        }
        catch (error) {
            next(error);
        }

    }

    public deleteEmployee = async (req: express.Request, res: express.Response, next: NextFunction) => {

        try {
            const employeeid = Number(req.params.id);
            const employee = await this.employeeService.getEmployeeByID(employeeid);
            console.log(employee);
            await this.employeeService.deleteEmployee(employee);
            res.status(200).send("employee deleted successfully");
        }
        catch (error) {
            next(error);
        }

    }

    public loginEmployee = async (req: express.Request, res: express.Response, next: NextFunction) => {
        const { email, password } = req.body;
        try {
            const token = await this.employeeService.loginEmployee(email,password);
            res.status(200).send({data:token});

        } catch (error) {
            next(error)
        }

    }



}
//    updateEmployee= async(req:express.Request,res:express.Response)=>{

//     const name = req.body.name;
//     const email = req.body.email;
//     const id = req.params.id
//     const savedEmployee = await this.employeeService.updateEmployee(id,name,email);
//     res.status(200).send(savedEmployee);


//     }


export default EmployeeController;