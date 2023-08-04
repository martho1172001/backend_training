import Department from "../entity/department.entity";
import DepartmentRepository from "../repository/department.repository";


class DepartmentService{
    constructor(private departmentRepository: DepartmentRepository){

    }

    getAllDepartment():Promise<Department[]>{
     return this.departmentRepository.find();
    }
}

export default DepartmentService;