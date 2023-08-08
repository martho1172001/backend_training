import Address from "../entity/address.entity";
import Employee from "../entity/employee.entity";
import HttpException from "../exception/http.exception";
import EmployeeRepository from "../repository/employee.repository";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import CreateEmployeeDto from "../dto/create-employee.dto";
import UpdateEmployeeDto from "../dto/update-employee.dto";
import DepartmentService from "./department.service";
import LoginDto from "../dto/login-dto";
import logger from "../logging/winston.log";

class EmployeeService {

  constructor(private employeeRepository: EmployeeRepository, private departmentService: DepartmentService) {}

  getAllEmployees(pageNumber: number, offset: number) {
    return this.employeeRepository.getEmployees(pageNumber, offset)
  }

  async getEmployeeByID(id: number, logStart: string): Promise<Employee | null> {
    const employee = await this.employeeRepository.findOneByID(id);
    if (!employee) {
      logger.warn(`${logStart} Unsuccessful employee retrieval: employee with id ${id} not found`);
      throw new HttpException(400, `Employee not found with id : ${id}`);
    }
    return employee;
  }

  async createAnEmployee(createEmployeeDTo: CreateEmployeeDto, logStart: string): Promise<any | null> {
    const department = await this.departmentService.getDepartmentByID(createEmployeeDTo.departmentId, logStart);
    if (!department) {
      logger.warn(`${logStart} Unsuccessful employee creation: department with id ${createEmployeeDTo.departmentId} not found`);
      throw new HttpException(400, `Department with id ${createEmployeeDTo.departmentId} does not exist`); // Handle if the department does not exist
    }
    const alreadyExists = await this.employeeRepository.findOneByUsername(createEmployeeDTo.username);
    if (alreadyExists) {
      logger.warn(`${logStart} Unsuccessful employee creation: username already exists`);
      throw new HttpException(400, `The username/username already exists`);
    }

    const newEmployee = new Employee();
    newEmployee.name = createEmployeeDTo.name;
    newEmployee.username = createEmployeeDTo.username;
    newEmployee.joiningDate = new Date(createEmployeeDTo.joiningDate);
    newEmployee.experience = createEmployeeDTo.experience;
    newEmployee.password = await bcrypt.hash(createEmployeeDTo.password, 10);
    newEmployee.role = createEmployeeDTo.role;

    const newAddress = new Address;
    newAddress.address_line_1 = createEmployeeDTo.address.address_line_1;
    newAddress.address_line_2 = createEmployeeDTo.address.address_line_2;
    newAddress.city = createEmployeeDTo.address.city;
    newAddress.country = createEmployeeDTo.address.country;
    newAddress.state = createEmployeeDTo.address.state;
    newAddress.pincode = createEmployeeDTo.address.pincode;

    newEmployee.address = newAddress;
    newEmployee.department = department;
    await this.employeeRepository.save(newEmployee);

    const employee = await this.employeeRepository.getEmployeeByUsername(newEmployee.username)

    return employee;
  }

  deleteEmployee(employee: Employee) {
    console.log(this.employeeRepository.softRemove(employee));
  }

  updateEmployee(updateEmployeeDTo: UpdateEmployeeDto, updatedEmployee: Employee): Promise<Employee | null> {

    updatedEmployee.name = updateEmployeeDTo.name;
    updatedEmployee.username = updateEmployeeDTo.username;
    updatedEmployee.joiningDate = updateEmployeeDTo.joiningDate;
    updatedEmployee.experience = updateEmployeeDTo.experience;
    updatedEmployee.role = updateEmployeeDTo.role;
    updatedEmployee.updatedAt = new Date();

    updatedEmployee.address.address_line_1 = updateEmployeeDTo.address.address_line_1;
    updatedEmployee.address.address_line_2 = updateEmployeeDTo.address.address_line_2;
    updatedEmployee.address.city = updateEmployeeDTo.address.city;
    updatedEmployee.address.country = updateEmployeeDTo.address.country;
    updatedEmployee.address.state = updateEmployeeDTo.address.state;
    updatedEmployee.address.pincode = updateEmployeeDTo.address.pincode;
    updatedEmployee.address.updatedAt = new Date();

    return this.employeeRepository.save(updatedEmployee);
  }

  assign = async (employee, patchDto) => {
    Object.assign(employee, patchDto);
    await this.employeeRepository.save(employee);
    return employee;
  }

  loginEmployee = async (loginDto: LoginDto, logStart: string) => {
    const employee = await this.employeeRepository.findOneByUsername(loginDto.username);
    if (!employee) {
      logger.warn(`${logStart} Unsuccessful login: Username not found`);
      throw new HttpException(401, "Invalid login credentials");
    }
    employee.isActive = true;
    await this.employeeRepository.save(employee);
    const result = await bcrypt.compare(loginDto.password, employee.password);
    if (!result) {
      logger.warn(`${logStart} Unsuccessful login:Invalid login credentials `);
      throw new HttpException(401, "Invalid login credentials");
    }

    const payload = {
      name: employee.name,
      username: employee.username,
      role: employee.role
    }

    const loginemployeedetails = await this.employeeRepository.getEmployeeByUsername(loginDto.username)
    const token = jsonwebtoken.sign(payload, process.env.JWT_SECRETKEY, {expiresIn: process.env.JWT_EXPIRY});
    return { token: token, employeeDetails: loginemployeedetails };
  }
}

export default EmployeeService;