import { DataSource } from "typeorm";
import Department from "../../entity/department.entity";
import DepartmentRepository from "../../repository/department.repository";
import DepartmentService from "../../service/department.service";
import { when } from "jest-when";

describe('Department service tests', () => {
    let departmentService;
    let departmentRepository;

    beforeAll(() => {
        const dataSource: DataSource = {
            getRepository: jest.fn()
        } as unknown as DataSource;
        departmentRepository = new DepartmentRepository(dataSource.getRepository(Department));
        departmentService = new DepartmentService(departmentRepository);
    });

    test('test for get all departments', async () => {
        const mockDepartment = {
            name: "hr"
        }
        const mockFunction = jest.fn();
        when(mockFunction).calledWith().mockResolvedValueOnce(mockDepartment);
        departmentRepository.find = mockFunction;
        const result = await departmentService.getAllDepartment();
        expect(result).toEqual(mockDepartment)
    })
    test('test for getDepartmentByID non existent one', async () => {
        const mockDepartment = {
            name: "hr"
        }
        const mockFunction = jest.fn();
        when(mockFunction).calledWith(1).mockResolvedValueOnce(null);
        departmentRepository.findOneBy = mockFunction;
        expect(async () => await departmentService.getDepartmentByID(1)).rejects.toThrowError();

    })
    test('test for getDepartmentByID valid one', async () => {
        const mockDepartment = {
            name: "hr"
        }
        const mockFunction = jest.fn();
        when(mockFunction).calledWith(1).mockResolvedValueOnce("dept");
        departmentRepository.findOneBy = mockFunction;
        const result = await departmentService.getDepartmentByID(1);
        expect(result).toEqual("dept")

    })
    test('test for createDepartment', async () => {
        const mockDepartment = {
            name: "hr"
        }

        const newDepartment = new Department();
        newDepartment.name = mockDepartment.name;
        const mockFunction = jest.fn();
        when(mockFunction).calledWith(newDepartment).mockResolvedValueOnce("dept");
        departmentRepository.save = mockFunction;
        const result = await departmentService.createDepartment(mockDepartment);
        expect(result).toEqual("dept");

    })
    test('test for createDepartment', async () => {
        const mockDepartment = {
            name: "hr"
        }

        const mockFunction = jest.fn();
        departmentRepository.softRemove = mockFunction;
        const result = await departmentService.deleteDepartment(mockDepartment);
        expect(departmentRepository.softRemove).toBeCalledWith(mockDepartment);

    })
    test('test for updateDepartment', async () => {
        const mockDepartment = {
            name: "hr"
        }

        const newDepartment = mockDepartment;
        newDepartment.name = "devops";
        const mockFunction = jest.fn();
        departmentRepository.save = mockFunction;
        const result = await departmentService.updateDepartment({ "name": "devops" }, mockDepartment);

        expect(departmentRepository.save).toBeCalledWith(newDepartment);


    })



})