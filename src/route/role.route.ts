import RoleController from "../controller/role.controller";
import RoleService from "../service/role.service";

const roleService = new RoleService();
const roleController = new RoleController(roleService);
const roleRouter = roleController.router;

export default roleRouter;