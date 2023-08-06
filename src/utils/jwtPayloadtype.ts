import {Role} from "./role.enum"

export type jwtPayload = {
    name:string;
    username:string;
    role:Role;
}