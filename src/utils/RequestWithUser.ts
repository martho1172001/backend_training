import { Request } from "express";
import { Role } from "./role.enum";

interface RequestWithUser extends Request{
    name:string;
    username:string;
    role:Role;
    traceId:string;
    startTime:Number;
}
export default RequestWithUser;