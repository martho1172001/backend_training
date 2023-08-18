
import {IsOptional, IsString } from "class-validator";

class PatchAddressDto{
    @IsOptional()
    @IsString()
    address_line_1?:string;

    @IsOptional()
    @IsString()
    address_line_2?:string;

    @IsOptional()
    @IsString()
    city?:string;

    @IsOptional()
    @IsString()
    state?:string;
    
    @IsOptional()
    @IsString()
    country?:string;

    @IsOptional()
    @IsString()
    pincode?:string;
}
export default PatchAddressDto;