import express from "express";



const employeeRouter = express.Router();

import Employee from "./employee";

let count=2;

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


employeeRouter.get('/',(req,res)=>{
    console.log("at / get ");
    console.log(req.url);
    res.status(200).send(employees);   
});

employeeRouter.get('/:id',(req,res)=>{
    console.log("at / get ");
    console.log(req.url);

    const employee1 = employees.find((employee)=>
        employee.id === Number(req.params.id))
   
    console.log(employee1);
    res.status(200).send(employee1);   

});

employeeRouter.post('/',(req,res)=>{
    console.log("at / post");

    console.log(req.url);
    console.log(req.body);
    const newEmployee = new Employee();
    newEmployee.name = req.body.name;
    newEmployee.email = req.body.email;
    newEmployee.id = ++count;
    newEmployee.createdAt = new Date();
    newEmployee.updatedAt = new Date();
    employees.push(newEmployee)
    res.status(200).send(newEmployee); 
      
});

employeeRouter.put('/:id',(req,res)=>{
    console.log("at / put");
    console.log(req.url);
     
    const employee1 = employees.find((employee)=>
        employee.id === Number(req.params.id))
        employee1.name = req.body.name;
        employee1.email = req.body.email;
        employee1.updatedAt = new Date();
        res.status(201).send("employee updated" + employee1); 
});


employeeRouter.delete('/:id',(req,res)=>{
    console.log("at / delete");
    console.log(req.url);
    const employeeid = employees.findIndex((employee)=>
    employee.id === Number(req.params.id))
    console.log(employeeid);
    employees.splice(employeeid,1);
    res.status(201).send(" employee deleted");   
});


export  {employeeRouter,employees};