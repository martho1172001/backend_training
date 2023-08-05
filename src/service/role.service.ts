import EmployeeController from "../controller/employee.controller"
import { Role } from "../utils/role.enum"

class RoleService{
    public getRoles = ()=>{
        return Object.values(Role);
    }
}

export default RoleService;