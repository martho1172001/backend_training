import { DataSource, Repository, UpdateResult } from "typeorm";
import Employee from "../entity/employee.entity";
import dataSource from "../db/postgress.db";
import HttpException from "../exception/http.exception";
import Address from "../entity/address.entity";
//import { UpdateResult } from "typeorm/driver/mongodb/typings";

class EmployeeRepository {
    constructor(private employeeRepository: Repository<Employee>) {
    }
    getEmployeesOnlyWithDepartmentId=async()=> {
        const employeesWithDepartment = await this.employeeRepository.find({
          relations: ['department'], 
        });
      
        const employeesWithOnlyDepartmentId = employeesWithDepartment.map((employee) => ({
          ...employee,
          //departmentId: employee.department?.id,
          departmentId: employee.department ? employee.department.id : null,
         
          department:undefined
          
          
        }));
      
       return employeesWithOnlyDepartmentId;
      }
      getEmployeeWithDepartmentIdUsingEmail=async(email)=> {
        const employeesWithDepartment = await this.employeeRepository.findOne({
            where:{email:email},
          relations: ['department','address'], 
          
        });
      
        const employeesWithOnlyDepartmentId = {
          ...employeesWithDepartment,
          departmentId: employeesWithDepartment.department ? employeesWithDepartment.department.id : null,
         
          department:undefined
          
          
        };
      
       return employeesWithOnlyDepartmentId;
      }
      getEmployeeWithOnlyDepartmentIdUisngEmail=async(email)=> {
        const employeesWithDepartment = await this.employeeRepository.findOne({
            where:{email:email},
          relations: ['department'], 
          
        });
        if(!employeesWithDepartment) {
            throw new HttpException(400,`Employee not found `);
            
    
        }
        const employeesWithOnlyDepartmentId = {
          ...employeesWithDepartment,
          departmentId: employeesWithDepartment.department ? employeesWithDepartment.department.id : null,
         
         
          department:undefined
          
          
        };
      
       return employeesWithOnlyDepartmentId;
      }
      getEmployeeWithDepartmentIdUsingID=async(id)=> {
        const employeesWithDepartment = await this.employeeRepository.findOne({
            where:{id:id},
          relations: ['department','address'], 
          
        });

        if(!employeesWithDepartment) {
            throw new HttpException(400,`Employee with id ${id}not found `);
               
        }

      
        const employeesWithOnlyDepartmentId = {
          ...employeesWithDepartment,
          departmentId: employeesWithDepartment.department ? employeesWithDepartment.department.id : null,
         

          department:undefined
          
          
        };
      
       return employeesWithOnlyDepartmentId;
      }
       
    find(): Promise<Employee[]> {
        return this.employeeRepository.find(
            {
                relations:{
                address:true,
                department:true
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