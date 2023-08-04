import { DataSource, Repository, UpdateResult } from "typeorm";
import Employee from "../entity/employee.entity";
import dataSource from "../db/postgress.db";
//import { UpdateResult } from "typeorm/driver/mongodb/typings";

class EmployeeRepository {
    constructor(private employeeRepository: Repository<Employee>) {
    }
    find(): Promise<Employee[]> {
        return this.employeeRepository.find(
            {
                relations:{
               address:true,
                }
            }
        );
    }

    findOneBy(id:number):Promise<Employee> {
        return this.employeeRepository.findOne({
            where: {id:id},
            relations:{
           address:true,
            }
        });
    }
    findOneByEmail(email:string):Promise<Employee> {
        return this.employeeRepository.findOne({
            where: {email:email},
            relations:{
           address:true,
            }
        });
    }

    save(newEmployee: Employee):Promise<Employee>{
        return this.employeeRepository.save(newEmployee);
    }
    softRemove(employee:Employee){

       console.log(this.employeeRepository.softRemove(employee)+"ffg") ;
    }


    


}

export default EmployeeRepository;