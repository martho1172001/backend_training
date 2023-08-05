import { IsEmail, IsNotEmpty, IsString } from "class-validator";

class LoginDto{
      
    @IsNotEmpty()
    @IsEmail()
    email:string;
    
    
    @IsNotEmpty()
    @IsString()
    password:string;
    
}
    
    export default LoginDto;