import { DataSource } from "typeorm";
import dataSource from "../../db/postgress.db";
import EmployeeService from "../../service/employee.service";
import Employee from "../../entity/employee.entity";
import { when } from "jest-when";
import EmployeeRepository from "../../repository/employee.repository";

describe('Employee service tests',()=>{
    let employeeService;
    let employeeRepository;
    beforeAll(()=>{
        const dataSource:DataSource={
            getRepository:jest.fn()
        } as unknown as DataSource;

        employeeRepository=new EmployeeRepository(dataSource.getRepository(Employee));
        employeeService=new EmployeeService(employeeRepository);
    });

describe('Test for getEmployeeByID',()=>{
     test('test employee for id 1',async()=>{
        const mockFunction = jest.fn();
        when(mockFunction).calledWith(1).mockResolvedValueOnce(null);
        employeeRepository.findOneBy=mockFunction;
        expect(async()=>await employeeService.getEmployeeByID(1)).rejects.toThrowError();
     })


    test('test employee for an id ',async()=>{
        const mockFunction = jest.fn();
        when(mockFunction).calledWith(1).mockResolvedValueOnce({"id":123,"name":"employee name"});
        employeeRepository.findOneBy=mockFunction;
        const employee = await employeeService.getEmployeeByID(1);
        expect(employee).toStrictEqual({"id":123,"name":"employee name"});
    })
})

})