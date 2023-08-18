import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import CreateAddressDto from "./create-employee-address.dto";
import Address from "../entity/address.entity";
import { Role } from "../utils/role.enum";

class UpdateEmployeeDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    departmentId: number;

    @IsNotEmpty()
    @IsNumber()
    experience: number;

    @IsNotEmpty()
isActive:string;

    @IsNotEmpty()
    @IsString()
    joiningDate: string;

    password: string;

    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateAddressDto)
    address: Address;

}
export default UpdateEmployeeDto