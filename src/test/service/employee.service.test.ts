import { DataSource } from "typeorm";
import dataSource from "../../db/postgress.db";
import EmployeeService from "../../service/employee.service";
import Employee from "../../entity/employee.entity";
import { when } from "jest-when";
import EmployeeRepository from "../../repository/employee.repository";
import DepartmentRepository from "../../repository/department.repository";
import Department from "../../entity/department.entity";
import DepartmentService from "../../service/department.service";
import Address from "../../entity/address.entity";
import { Role } from "../../utils/role.enum";
import LoginDto from "../../dto/login-dto";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

describe('Employee service tests', () => {
    let employeeService;
    let employeeRepository;
    let departmentRepository;
    let departmentService
    beforeAll(() => {
        const dataSource: DataSource = {
            getRepository: jest.fn()
        } as unknown as DataSource;
        departmentRepository = new DepartmentRepository(dataSource.getRepository(Department));
        departmentService = new DepartmentService(departmentRepository);
        employeeRepository = new EmployeeRepository(dataSource.getRepository(Employee));
        employeeService = new EmployeeService(employeeRepository, departmentService);
        departmentService = {
            getDepartmentByID: jest.fn(),
        };
        employeeRepository = {
            findOneByusername: jest.fn(),
            save: jest.fn(),
            getEmployeeWithOnlyDepartmentIdUsingusername: jest.fn(),
        };


    });




    test('test employee for id NOT EXISTING', async () => {
        const mockFunction = jest.fn();
        when(mockFunction).calledWith(1).mockResolvedValueOnce(null);
        employeeRepository.getEmployeeWithDepartmentIdUsingID = mockFunction;
        expect(async () => await employeeService.getEmployeeByID(1)).rejects.toThrowError();
    })


    test('test for getEmployeeById VALID CASE ', async () => {
        const employeeId = 1;

        // Mock the response from the repository
        const mockEmployee: Object = {
            // mock your employee object here
            "name": "mariya"
        };

        const mockFunction = jest.fn();
        when(mockFunction).calledWith(1).mockResolvedValueOnce(mockEmployee);
        employeeRepository.getEmployeeWithDepartmentIdUsingID = mockFunction;

        // Call the method and expect the result
        const result = await employeeService.getEmployeeByID(employeeId);

        expect(result).toEqual(mockEmployee);
        expect(employeeRepository.getEmployeeWithDepartmentIdUsingID).toHaveBeenCalledWith(employeeId);
    });


    test('test for GetAllEmployees ', async () => {


        // Mock the response from the repository
        const mockEmployee: Object = {
            // mock your employee object here
            "name": "mariya"
        };

        const mockFunction = jest.fn();
        when(mockFunction).calledWith().mockResolvedValueOnce(mockEmployee);
        employeeRepository.getEmployeesOnlyWithDepartmentId = mockFunction;

        // Call the method and expect the result
        const result = await employeeService.getAllEmployee();

        expect(result).toEqual(mockEmployee);
        expect(employeeRepository.getEmployeesOnlyWithDepartmentId).toHaveBeenCalledWith();
    });
    test('test for createAnEmployee ', async () => {


        const mockEmployee: Object = {
            "name": "mariya"
        };
        const mockDepartment: Object = {
            "name": "devops"
        };

        const mockFunction = jest.fn();
        when(mockFunction).calledWith(1).mockResolvedValue(mockDepartment);
        departmentService.getDepartmentByID = mockFunction;
        const result = await departmentService.getDepartmentByID(1);
        expect(result).toEqual(mockDepartment);

        const mockFunction3 = jest.fn();
        when(mockFunction3).calledWith("mariya").mockResolvedValue("mariya details");
        employeeRepository.findOneByusername = mockFunction3;
        expect(async () => await employeeService.getEmployeeByID("mariya")).rejects.toThrowError();

        const mockFunction2 = jest.fn();
        when(mockFunction2).calledWith(1).mockResolvedValue(null);
        departmentService.getDepartmentByID = mockFunction2;
        expect(async () => await employeeService.getEmployeeByID(1)).rejects.toThrowError();




    });

    test('test for deleteEmployee ', async () => {


        // Mock the response from the repository
        const mockEmployee: Employee = {
            // mock your employee object here
            "name": "mariya",
            username: "dfd",
            password: "dgfd",
            joiningDate: new Date,
            isActive: false,
            experience: 0,
            role: Role.UI,
            address: new Address,
            department: new Department,
            id: 1,
            createdAt: new Date,
            updatedAt: new Date,
            deletedAt: new Date
        };

        const mockFunction2 = jest.fn();
        when(mockFunction2).calledWith(mockEmployee).mockResolvedValue(12);
        employeeRepository.softRemove = mockFunction2;
        await employeeService.deleteEmployee(mockEmployee);
        expect(employeeRepository.softRemove).toHaveBeenCalledWith(mockEmployee);
    });

    test('test assigning employee', async () => {
        const mockFunction = jest.fn();
        when(mockFunction).calledWith("hello").mockResolvedValueOnce("helloresult");
        employeeRepository.save = mockFunction;

        await employeeService.assign("helloq");
        expect(async () => await employeeService.save().toHaveBeenCalledWith("helloq"));
        expect(async () => await employeeService.save().toEqual("hellresult"));

    });
    test('test for login employee ', async () => {

        const logindto = {
            "username": "mariya",
            "password": "htftyfyt"
        }
        const mockEmployee = {
            "username": "mariya",
            "password": "htftyfyt"
        }
        const logindetails = {
            "username": "mariya",
            "password": "htftyfyt"
        }
        employeeRepository.findOneByusername.mockResolvedValueOnce(mockEmployee);

        employeeRepository.save.mockResolvedValueOnce(mockEmployee);
        bcrypt.compare = jest.fn().mockResolvedValue(true);

        const mockFunction = jest.fn();
        employeeRepository.getEmployeeWithOnlyDepartmentIdUsingusername = mockFunction
        employeeRepository.getEmployeeWithOnlyDepartmentIdUsingusername.mockResolvedValueOnce(logindetails)
        const mockToken = 'mock-jwt-token';
        jsonwebtoken.sign = jest.fn().mockReturnValue(mockToken);

        await employeeService.loginEmployee(logindto);
        expect(employeeRepository.findOneByusername).toHaveBeenCalled
        expect(employeeRepository.save).toHaveBeenCalled
        expect(employeeRepository.getEmployeeWithOnlyDepartmentIdUsingusername).toHaveBeenCalled




    })
    test('test for login employee invalid username ', async () => {

        const logindto = {
            "username": "mariya",
            "password": "htftyfyt"
        }
        const mockEmployee = {
            "username": "mariya",
            "password": "htftyfyt"
        }
        const logindetails = {
            "username": "mariya",
            "password": "htftyfyt"
        }
        employeeRepository.findOneByusername.mockResolvedValueOnce(null);

        employeeRepository.save.mockResolvedValueOnce(mockEmployee);
        bcrypt.compare = jest.fn().mockResolvedValue(true);

        const mockFunction = jest.fn();
        employeeRepository.getEmployeeWithOnlyDepartmentIdUsingusername = mockFunction
        employeeRepository.getEmployeeWithOnlyDepartmentIdUsingusername.mockResolvedValueOnce(logindetails)
        const mockToken = 'mock-jwt-token';
        jsonwebtoken.sign = jest.fn().mockReturnValue(mockToken);


        expect(async () => await employeeService.loginEmployee(logindto)).rejects.toThrowError();




    })
    test('test for login employee invalid password ', async () => {

        const logindto = {
            "username": "mariya",
            "password": "htftyfyt"
        }
        const mockEmployee = {
            "username": "mariya",
            "password": "htftyfyt"
        }
        const logindetails = {
            "username": "mariya",
            "password": "htftyfyt"
        }

        employeeRepository.findOneByusername.mockResolvedValueOnce(mockEmployee);

        employeeRepository.save.mockResolvedValueOnce(mockEmployee);
        bcrypt.compare = jest.fn().mockResolvedValue(false);

        const mockFunction = jest.fn();
        employeeRepository.getEmployeeWithOnlyDepartmentIdUsingusername = mockFunction
        employeeRepository.getEmployeeWithOnlyDepartmentIdUsingusername.mockResolvedValueOnce(logindetails)
        const mockToken = 'mock-jwt-token';
        jsonwebtoken.sign = jest.fn().mockReturnValue(mockToken);


        expect(async () => await employeeService.loginEmployee(logindto)).rejects.toThrowError();




    })

    test('test for update employee', async () => {

        const updatedto = {

            "name": "Ashok",
            "username": "ash",
            "password": "ashok",
            "joiningDate": "11/02/2012",
            "experience": 8,
            "departmentId": "2",
            "role": "admin",
            "address": {
                "address_line_1": "Edachira",
                "address_line_2": "Kakkanad",
                "city": "Ernakulam",
                "state": "Kerala",
                "country": "India",
                "pincode": "682024"
            }
        }
        const mockEmployee = {

            "name": "Ashok",
            "username": "ashwin",
            "password": "ashok",
            "joiningDate": "11/02/2012",
            "experience": 8,
            "departmentId": "2",
            "role": "admin",
            "address": {
                "address_line_1": "Edachira",
                "address_line_2": "Kakkanad",
                "city": "Ernakulam",
                "state": "Kerala",
                "country": "India",
                "pincode": "682024"
            }
        }

        const mockFunction = jest.fn();
        employeeRepository.save = mockFunction;
        await employeeService.updateEmployee(updatedto, mockEmployee)
        expect(employeeRepository.save).toBeCalledWith(mockEmployee)
    })

    test('test for valid create employee', async () => {

        const createdto = {
            "name": "Ashok",
            "username": "ash",
            "password": "ashok",
            "joiningDate": "11/02/2012",
            "experience": 8,
            "departmentId": 1,
            "role": "admin",
            "address": {
                "address_line_1": "Edachira",
                "address_line_2": "Kakkanad",
                "city": "Ernakulam",
                "state": "Kerala",
                "country": "India",
                "pincode": "682024"
            }
        }


        const mockEmployee: Object = {
            "name": "Ashok",
            "username": "marriya",
            "password": "ashok",
            "joiningDate": "11/02/2012",
            "experience": 8,
            "departmentId": 1,
            "role": "admin",
            "address": {
                "address_line_1": "Edachira",
                "address_line_2": "Kakkanad",
                "city": "Ernakulam",
                "state": "Kerala",
                "country": "India",
                "pincode": "682024"
            }
        };
        const mockDepartment: Department = {
            "createdAt": new Date("2022-10-04T09:05:26.989Z"),
            "updatedAt": new Date("2022-10-04T09:06:49.690Z"),
            "deletedAt": new Date(),
            "id": 1,
            "name": "Product Engineering",
            "employee": new Employee
        };
        const newEmployee = new Employee();
        Object.assign(newEmployee, createdto);
        departmentService.getDepartmentByID.mockResolvedValue(mockDepartment);
        employeeRepository.findOneByusername.mockResolvedValue(null);
        employeeRepository.save.mockResolvedValue(mockEmployee);
        const mockFunction1 = jest.fn();
        employeeRepository.getEmployeeWithDepartmentIdUsingusername = mockFunction1;
        employeeRepository.getEmployeeWithDepartmentIdUsingusername.mockResolvedValue(mockEmployee);


        const result = await employeeService.createAnEmployee(createdto, 'logStart');

        expect(departmentService.getDepartmentByID).toHaveBeenCalled
        expect(employeeRepository.findOneByusername).toHaveBeenCalled
        expect(employeeRepository.save).toHaveBeenCalled
        expect(employeeRepository.getEmployeeWithDepartmentIdUsingusername).toHaveBeenCalled


    })
    test('test for create employee invalid department', async () => {

        const createdto = {
            "name": "Ashok",
            "username": "ash",
            "password": "ashok",
            "joiningDate": "11/02/2012",
            "experience": 8,
            "departmentId": 1,
            "role": "admin",
            "address": {
                "address_line_1": "Edachira",
                "address_line_2": "Kakkanad",
                "city": "Ernakulam",
                "state": "Kerala",
                "country": "India",
                "pincode": "682024"
            }
        }
        const newEmployee = new Employee();
        Object.assign(newEmployee, createdto);

        departmentService.getDepartmentByID.mockResolvedValue(null);

        employeeRepository.findOneByusername.mockResolvedValue(newEmployee);
        expect(async () => await employeeService.createAnEmployee(createdto, 'log')).rejects.toThrowError();

    })
    test('test for create employee existing username', async () => {

        const createdto = {
            "name": "Ashok",
            "username": "ash",
            "password": "ashok",
            "joiningDate": "11/02/2012",
            "experience": 8,
            "departmentId": 1,
            "role": "admin",
            "address": {
                "address_line_1": "Edachira",
                "address_line_2": "Kakkanad",
                "city": "Ernakulam",
                "state": "Kerala",
                "country": "India",
                "pincode": "682024"
            }
        }

        const mockDepartment: Department = {
            "createdAt": new Date("2022-10-04T09:05:26.989Z"),
            "updatedAt": new Date("2022-10-04T09:06:49.690Z"),
            "deletedAt": new Date(),
            "id": 1,
            "name": "Product Engineering",
            "employee": new Employee
        };
        const newEmployee = new Employee();
        Object.assign(newEmployee, createdto);

        departmentService.getDepartmentByID.mockResolvedValue(mockDepartment);
        employeeRepository.findOneByusername.mockResolvedValue(newEmployee);
        expect(async () => await employeeService.createAnEmployee(createdto, 'log')).rejects.toThrowError();

    })







})


