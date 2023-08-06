import CreateDepartmentDto from "../dto/create-department.dto";
import UpdateDepartmentDto from "../dto/update-department.dto";
import Department from "../entity/department.entity";
import Employee from "../entity/employee.entity";
import HttpException from "../exception/http.exception";
import DepartmentRepository from "../repository/department.repository";


class DepartmentService{
    constructor(private departmentRepository: DepartmentRepository){

    }

    async getAllDepartment():Promise<Department[]>{
     return await  this.departmentRepository.find();
    }

    async getDepartmentByID(id:number): Promise<Department |null> {
        const department= await this.departmentRepository.findOneBy(id);
        if(!department) {
            throw new HttpException(400,`Department not found with id : ${id}`);
        }
        return department;
    }

    async createDepartment(createDepartmentDTo:CreateDepartmentDto): Promise<Department |null>{
        const newDepartment = new Department();
        newDepartment.name = createDepartmentDTo.name;
        return this.departmentRepository.save(newDepartment);
    }



    deleteDepartment=async(department:Department) =>{
        return this.departmentRepository.softRemove(department);
    }
  
    updateDepartment(updateDepartmentDTo:UpdateDepartmentDto,updatedDepartment:Department):Promise<Department |null>{
   
        updatedDepartment.name = updateDepartmentDTo.name;
        updatedDepartment.updatedAt=new Date();
        return this.departmentRepository.save(updatedDepartment);
    }


}

export default DepartmentService;