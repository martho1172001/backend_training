import { Repository } from "typeorm";
import Department from "../entity/department.entity";

class DepartmentRepository{
    
    constructor(private departmentRepostitory:Repository<Department>){}
    find():Promise<Department[]>{
        return this.departmentRepostitory.find({
            relations:{
        //        employee:true
            }
        })
    }

}

export default DepartmentRepository;