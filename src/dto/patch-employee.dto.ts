import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from "class-validator";
import Address from "../entity/address.entity";
import { Type } from "class-transformer";
import CreateAddressDto from "./create-employee-address.dto";
import { Role } from "../utils/role.enum";
import { Column } from "typeorm";
import Department from "../entity/department.entity";
import PatchAddressDto from "./patch-employee-address.dto";



class PatchEmployeeDto{

@IsOptional()
@IsString()
name?:string;

@IsOptional()
@IsEmail()
email?:string;

@IsOptional()
@IsNumber()
age?:number;

@IsOptional()
@IsString()
password?:string;

@IsOptional()
@IsEnum(Role)
role?:Role;


@IsOptional()
@Column()
departmentId?:number;

// @IsOptional()
// @ValidateNested()
// @Type(()=>PatchAddressDto)
// address?:Address;

}

export default PatchEmployeeDto;