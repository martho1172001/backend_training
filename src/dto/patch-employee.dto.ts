import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from "class-validator";
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
@IsString()
username?:string;

@IsOptional()
@IsNumber()
experience?:number;

@IsOptional()
@IsDate()
joiningDate?:string;

@IsOptional()
@IsString()
password?:string;

@IsNotEmpty()
isActive?:string;

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