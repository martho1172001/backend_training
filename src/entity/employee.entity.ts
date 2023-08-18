import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Address from "./address.entity";
import Department from "./department.entity";
import AbstractEntity from "./abstract.entity";
import { Role } from "../utils/role.enum";

@Entity("employees")
class Employee extends AbstractEntity {

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    password: string;
    
    @Column()
    joiningDate:string;

    @Column({nullable:true})
    isActive:string;

    @Column()
    experience: number;

    @Column({default: Role.DEVELOPER})
    role:Role;
  
    @OneToOne(() => Address, (address) => address.employee, { cascade: true, onDelete: "CASCADE" })
    address: Address;
    @Column()
    departmentId:number;

    @ManyToOne(() => Department, (department) => department.employee)
    @JoinColumn()
    department: Department;

}

export default Employee;