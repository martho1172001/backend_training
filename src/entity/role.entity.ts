import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Employee from "./employee.entity";
import AbstractEntity from "./abstract.entity";
import { Role } from "../utils/role.enum";

@Entity()
class RoleClass  extends AbstractEntity {


    @Column()
    role: Role;

    

    @OneToMany(()=>Employee,(employee)=>employee.role_id)
    employee:Employee;
    

}
export default RoleClass;