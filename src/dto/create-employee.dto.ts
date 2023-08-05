import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested} from "class-validator";
import Address from "../entity/address.entity";
import { Type } from "class-transformer";
import CreateAddressDto from "./create-employee-address.dto";
import { Role } from "../utils/role.enum";
import { Column } from "typeorm";
import Department from "../entity/department.entity";



class CreateEmployeeDto{
@IsNotEmpty()
@IsString()
name:string;


@IsNotEmpty()
@IsEmail()
email:string;

@IsNotEmpty()
@IsNumber()
age:number;

@IsNotEmpty()
@IsString()
password:string;

@IsNotEmpty()
@IsEnum(Role)
role:Role;


@Column()
departmentId:number;

@IsNotEmpty()
@ValidateNested({each:true})
@Type(()=>CreateAddressDto)
address:Address;
}

export default CreateEmployeeDto;