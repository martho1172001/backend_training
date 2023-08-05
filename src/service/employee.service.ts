import Address from "../entity/address.entity";
import Employee from "../entity/employee.entity";
import HttpException from "../exception/http.exception";
import EmployeeRepository from "../repository/employee.repository";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { Role } from "../utils/role.enum";
import CreateEmployeeDto from "../dto/create-employee.dto";
import UpdateEmployeeDto from "../dto/update-employee.dto";
import DepartmentRepository from "../repository/department.repository";
import DepartmentService from "./department.service";
import LoginDto from "../dto/login-dto";
import PatchEmployeeDto from "../dto/patch-employee.dto";
import PatchAddressDto from "../dto/patch-employee-address.dto";
import { plainToInstance } from "class-transformer";


class EmployeeService{
    
    constructor(private employeeRepository: EmployeeRepository,private departmentService: DepartmentService){
    }

getAllEmployee(): Promise<Employee[]>{
    return this.employeeRepository.getEmployeesOnlyWithDepartmentId();
}

async getEmployeeByID(id:number): Promise<Employee |null> {
    const employee= await this.employeeRepository.getEmployeeWithDepartmentIdUsingID(id);
    if(!employee) {
        throw new HttpException(400,`Employee not found with id : ${id}`);
        

    }
    return employee;
}
    async createAnEmployee(createEmployeeDTo:CreateEmployeeDto): Promise<any |null>{
        const department = await this.departmentService.getDepartmentByID(createEmployeeDTo.departmentId);
    if (!department) {
      throw new HttpException(400,`Department with id ${createEmployeeDTo.departmentId} does not exist`); // Handle if the department does not exist
    }
    const alreadyExists = await this.employeeRepository.findOneByEmail(createEmployeeDTo.email);
    if (alreadyExists) {
      throw new HttpException(400,`The username/email already exists`); 
    }

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
    
    
  
    // Set the department for the employee
    newEmployee.department = department;
    await this.employeeRepository.save(newEmployee);
    const employee = await this.employeeRepository.getEmployeeWithDepartmentIdUsingEmail(newEmployee.email)
    
    return employee;
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
assign=async(employee,patchDto)=>{

    
        Object.assign(employee, patchDto);
        return employee;
    
    
    // Object.assign(patchEmployee,patchEmployeeDTo)
    // patchEmployee.updatedAt=new Date();
    
    // return this.employeeRepository.save(patchEmployee);
}
patchAddress(patchAddressDto:PatchAddressDto,patchEmployee:Employee){
   
    patchEmployee.updatedAt=new Date();
    if(patchAddressDto)
    {patchEmployee.address.updatedAt=new Date();
        Object.assign(patchEmployee.address,patchAddressDto)
    }
    return this.employeeRepository.save(patchEmployee);
}


loginEmployee=async(loginDto:LoginDto)=>{
   const employee=await this.employeeRepository.findOneByEmail(loginDto.email);
   if(!employee){
    throw new HttpException(400,"Username not found");
   }

  const result= await bcrypt.compare(loginDto.password, employee.password);
  if(!result){
    throw new HttpException(400,"Invalid login credentials");
  
  }

  const payload={
    name:employee.name,
    email:employee.email,
    role:employee.role
  }

  const loginemployeedetails = await this.employeeRepository.getEmployeeWithOnlyDepartmentIdUisngEmail(loginDto.email)
    
  const token=jsonwebtoken.sign(payload,process.env.JWT_SECRETKEY,{
    expiresIn:process.env.JWT_EXPIRY
  });
return {token:token,employeeDetails:loginemployeedetails};

}

}





export default EmployeeService;