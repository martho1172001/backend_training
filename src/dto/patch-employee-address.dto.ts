
import {IsOptional, IsString } from "class-validator";

class PatchAddressDto{
    @IsOptional()
    @IsString()
    line1?:string;

    @IsOptional()
    @IsString()
    pincode?:string;
}
export default PatchAddressDto;