import express from "express"
import EmployeeService from "../service/employee.service";
import DepartmentService from "../service/department.service";

class DepartmentController{
    public router:express.Router;
    constructor(private departmentService: DepartmentService){
        this.router=express.Router();
        this.router.get("/",this.getAllDepartments)
    }

    getAllDepartments = async(req: express.Request, res: express.Response)=>{


        const departments = this.departmentService.getAllDepartment();
        res.status(200).send(departments);
    }
}

export default DepartmentController;