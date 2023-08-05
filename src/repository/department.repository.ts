import { Repository } from "typeorm";
import Department from "../entity/department.entity";

class DepartmentRepository{
    
    constructor(private departmentRepostitory:Repository<Department>){}
    find():Promise<Department[]>{
        return this.departmentRepostitory.find()
    }

    findOneBy(id:number):Promise<Department> {
        return this.departmentRepostitory.findOne({
            where: {id:id},
            
        });
    }
    save(newDepartment: Department):Promise<Department>{
        return this.departmentRepostitory.save(newDepartment);
    }
    softRemove(department:Department){

        //console.log(this.departmentRepostitory.softRemove(department)+"softremoved") ;
        return this.departmentRepostitory.softRemove(department);
     }

}


export default DepartmentRepository;