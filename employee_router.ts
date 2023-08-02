import express from "express";



const employeeRouter = express.Router();

import Employee from "./employee";
//import { Client } from 'pg'
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import dataSource from "./data-source";

// const client = new Client({
//     host: 'localhost',
//     port: 8765,
//     database: 'training',
//     user: 'postgres',
//     password: 'postgres',
// }

// )




// await dataSource.initialize();

let count = 2;

const employees: Employee[] = [{
    id: 1,
    name: "mariya",
    email: "martho@gmail.com",
    createdAt: new Date(),
    updatedAt: new Date()
},
{
    id: 2,
    name: "linette",
    email: "linu@gmail.com",
    createdAt: new Date(),
    updatedAt: new Date()
},
]


employeeRouter.get('/', async(req, res) => {
    console.log("at / get ");
    console.log(req.url);
    const employeeRepository = dataSource.getRepository(Employee);
    const employee = await employeeRepository.find();
    
    res.status(200).send(employee);
});

employeeRouter.get('/:id', async (req, res) => {
    console.log("at / get ");
    console.log(req.url);
    const employeeRepository = dataSource.getRepository(Employee);
    const employee = await employeeRepository.findOneBy({id:Number(req.params.id)})
    // const result = await dataSource.query('SELECT * from employees where id = $1', [req.params.id])
    // console.log(result.rows[0]);
    // // const employee = result.rows[0];
    res.status(200).send(employee);
    // await dataSource.end();

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
    // const employeeid = employees.findIndex((employee) =>
    //     employee.id === Number(req.params.id))
    // console.log(employeeid);
    // employees.splice(employeeid, 1);



    const employeeRepository = dataSource.getRepository(Employee);
    const employee = await employeeRepository.findOneBy({id:Number(req.params.id)})

    const delEmployee = await employeeRepository.remove(employee)

    res.status(200).send(` employee with ${req.params.id} deleted`);
});


export { employeeRouter, employees };