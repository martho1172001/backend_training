import DepartmentController from "../controller/department.controller";
import dataSource from "../db/postgress.db";
import Department from "../entity/department.entity";
import DepartmentRepository from "../repository/department.repository";
import DepartmentService from "../service/department.service";


const departmentRepository=new DepartmentRepository(dataSource.getRepository(Department));
const departmentService =  new DepartmentService(departmentRepository);
const departmentController=new DepartmentController(departmentService);
const departmentRouter=departmentController.router;

export {departmentRouter,departmentService};