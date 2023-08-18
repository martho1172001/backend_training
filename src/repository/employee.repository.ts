import { DataSource, Repository, UpdateResult } from "typeorm";
import Employee from "../entity/employee.entity";
import dataSource from "../db/postgress.db";
import HttpException from "../exception/http.exception";
import Address from "../entity/address.entity";
//import { UpdateResult } from "typeorm/driver/mongodb/typings";

class EmployeeRepository {
  constructor(private employeeRepository: Repository<Employee>) {}

  getEmployees = async (pageNumber=1, offset=10) => {
    const count = await this.employeeRepository.createQueryBuilder().getCount()
    const employeesWithDepartment = await this.employeeRepository.find({
      skip: (pageNumber - 1) * offset,
      take: offset,
      relations: ['address']
    });
    return { employeesWithDepartment, count };
  }

  getEmployeeByUsername = async (username:string) => {
    const employeesWithDepartment = await this.employeeRepository.findOne({
      where: { username: username },
    });
    return employeesWithDepartment;
  }

  findOneByID = async (id:number):Promise<Employee | null>  => {
    const employeesWithDepartment = await this.employeeRepository.findOne({
      where: { id: id },
      relations: ['address'],
    });
    return employeesWithDepartment;
  }

  findOneByUsername(username: string): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: { username: username },
      relations: ['address']
    });
  }

  find(): Promise<Employee[]> {
    return this.employeeRepository.find(
      {
        relations: {
          address: true,
        }
      }
    );
  }

  save(newEmployee: Employee): Promise<Employee> {
    return this.employeeRepository.save(newEmployee);
  }

  softRemove(employee: Employee) {
    this.employeeRepository.softRemove(employee);
  }

}
export default EmployeeRepository;