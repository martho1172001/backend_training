import { IsEmail, IsNotEmpty, IsNumber, IsString, ValidateNested} from "class-validator";
import Address from "../entity/address.entity";
import { Type } from "class-transformer";
import CreateAddressDto from "./create-address.dto";



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
@ValidateNested({each:true})
@Type(()=>CreateAddressDto)
address:Address;
}

export default CreateEmployeeDto;