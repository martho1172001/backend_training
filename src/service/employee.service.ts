import Address from "../entity/address.entity";
import Employee from "../entity/employee.entity";
import HttpException from "../exception/http.exception";
import EmployeeRepository from "../repository/employee.repository";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { Role } from "../utils/role.enum";
import CreateEmployeeDto from "../dto/create-employee.dto";
import UpdateEmployeeDto from "../dto/update-employee.dto";


class EmployeeService{
    
    constructor(private employeeRepository: EmployeeRepository){
    }

getAllEmployee(): Promise<Employee[]>{
    return this.employeeRepository.find();
}

async getEmployeeByID(id:number): Promise<Employee |null> {
    const employee= await this.employeeRepository.findOneBy(id);
    if(!employee) {
        throw new HttpException(400,`Employee not found with id : ${id}`);
        

    }
    return employee;
}
    async createAnEmployee(createEmployeeDTo:CreateEmployeeDto): Promise<Employee |null>{
    const newEmployee = new Employee();
    newEmployee.name = createEmployeeDTo.name;
    newEmployee.email = createEmployeeDTo.email;
    newEmployee.age = createEmployeeDTo.age;
    newEmployee.password = await bcrypt.hash(createEmployeeDTo.password,10);
    newEmployee.role = createEmployeeDTo.role;
    const newAddress = new Address;
    newAddress.line1=createEmployeeDTo.address.line1;
    newAddress.pincode= createEmployeeDTo.address.pincode;
    newEmployee.address=newAddress;
    return this.employeeRepository.save(newEmployee);
}
deleteEmployee(employee:Employee) {
    console.log(this.employeeRepository.softRemove(employee));
}

updateEmployee(updateEmployeeDTo:UpdateEmployeeDto,updatedEmployee:Employee):Promise<Employee |null>{
   
    updatedEmployee.name = updateEmployeeDTo.name;
    updatedEmployee.email = updateEmployeeDTo.email;
    updatedEmployee.updatedAt=new Date();
    updatedEmployee.address.line1=updateEmployeeDTo.address.line1;
    updatedEmployee.address.pincode= updateEmployeeDTo.address.pincode;
    updatedEmployee.address.updatedAt=new Date();
    return this.employeeRepository.save(updatedEmployee);
}

loginEmployee=async(email:string,password:string)=>{
   const employee=await this.employeeRepository.findOneByEmail(email);
   if(!employee){
    throw new HttpException(400,"Username not found");
   }

  const result= await bcrypt.compare(password, employee.password);
  if(!result){
    throw new HttpException(400,"Invalid login credentials");
  
  }

  const payload={
    name:employee.name,
    email:employee.email,
    role:employee.role
  }
  const token=jsonwebtoken.sign(payload,process.env.JWT_SECRETKEY,{
    expiresIn:process.env.JWT_EXPIRY
  });
return {token:token};

}

}





export default EmployeeService;