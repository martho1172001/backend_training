import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Employee from "./employee.entity";
import AbstractEntity from "./abstract.entity";

@Entity()
class Department  extends AbstractEntity {


    @Column()
    name: string;

    

    @OneToMany(()=>Employee,(employee)=>employee.department)
    employee:Employee;
    

}
export default Department;