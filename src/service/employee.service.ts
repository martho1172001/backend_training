import Address from "../entity/address.entity";
import Employee from "../entity/employee.entity";
import HttpException from "../exception/http.exception";
import EmployeeRepository from "../repository/employee.repository";

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
createAnEmployee(name:string,email:string,address:any): Promise<Employee |null>{
    const newEmployee = new Employee();
    newEmployee.name = name;
    newEmployee.email = email;
    const newAddress = new Address;
    newAddress.line1=address.line1;
    newAddress.pincode= address.pincode;
    newEmployee.address=newAddress;
    return this.employeeRepository.save(newEmployee);
}
deleteEmployee(employee:Employee) {
    console.log(this.employeeRepository.softRemove(employee));
}

updateEmployee(name:string ,email:string,address:any,updatedEmployee:Employee):Promise<Employee |null>{
   
    updatedEmployee.name = name;
    updatedEmployee.email = email;
    updatedEmployee.updatedAt=new Date();
    updatedEmployee.address.line1=address.line1;
    updatedEmployee.address.pincode= address.pincode;
    updatedEmployee.address.updatedAt=new Date();
    return this.employeeRepository.save(updatedEmployee);
}

}



export default EmployeeService;