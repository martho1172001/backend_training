import express from "express";



const employeeRouter = express.Router();

import Employee from "./employee";
import { DataSource,FindOptionsWhere,Like } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import dataSource from "./data-source";







employeeRouter.get('/', async(req, res) => {
    console.log("at / get ");
    console.log(req.url);
    const nameFilter = req.query.name;
    const emailFilter = req.query.email;
    console.log(nameFilter as string);


    const employeeRepository = dataSource.getRepository(Employee);


    const querybuilder = employeeRepository.createQueryBuilder();
    if(nameFilter)
    querybuilder.andWhere("name LIKE :name",{name: `%${nameFilter as string}%`});
    if(emailFilter)
    querybuilder.andWhere("email LIKE :email",{email: `%${emailFilter as string}%`});
    
    
    const employee=await querybuilder.getMany();
    // const filters : FindOptionsWhere<Employee>= {};
    // if(nameFilter){
    //     filters.name = Like("%" + nameFilter as string +"%");
    // }

    // const employee = await employeeRepository.find({
    //     where:filters
    // });
    
    res.status(200).send(employee);
});

employeeRouter.get('/:id', async (req, res) => {
    console.log("at / get ");
    console.log(req.url);
    const employeeRepository = dataSource.getRepository(Employee);
    const employee = await employeeRepository.findOneBy({id:Number(req.params.id)})
    res.status(200).send(employee);

});

employeeRouter.post('/', async(req, res) => {
    console.log("at / post");

    console.log(req.url);
    console.log(req.body);
    const newEmployee = new Employee();
    newEmployee.name = req.body.name;
    newEmployee.email = req.body.email;
    const employeeRepository = dataSource.getRepository(Employee);
    const savedEmployee = await employeeRepository.save(newEmployee)
    
    res.status(200).send(savedEmployee);

});

employeeRouter.put('/:id', async(req, res) => {
    console.log("at / put");
    console.log(req.url);

    const employeeRepository = dataSource.getRepository(Employee);
    const employee = await employeeRepository.findOneBy({id:Number(req.params.id)})
    employee.name = req.body.name;
    employee.email = req.body.email;
    employee.updatedAt = new Date();

    const savedEmployee = await employeeRepository.save(employee)
    res.status(200).send(` employee with ${req.params.id} updated`);
});


employeeRouter.delete('/:id', async(req, res) => {
    console.log("at / delete");
    console.log(req.url);
    const employeeRepository = dataSource.getRepository(Employee);
    const employee = await employeeRepository.findOneBy({id:Number(req.params.id)})

    const delEmployee = await employeeRepository.softRemove(employee)

    res.status(200).send(` employee with ${req.params.id} deleted`);
});


export { employeeRouter };