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
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    age: number;
     

    @Column({default: Role.DEVELOPER})
    role:Role;

    @OneToOne(() => Address, (address) => address.employee, { cascade: true, onDelete: "CASCADE" })
    address: Address;


    @ManyToOne(() => Department, (department) => department.employee, { cascade: true })
    @JoinColumn()
    department: Department;


}

export default Employee;