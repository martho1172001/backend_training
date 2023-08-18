import EmployeeController from "../controller/employee.controller"
import logger from "../logging/winston.log";
import { Role } from "../utils/role.enum"

class RoleService {
    public getRoles = (logStart: string) => {
        logger.info(`${logStart} Retrieving roles `);
        return Object.values(Role);
    }
}

export default RoleService;