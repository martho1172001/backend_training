
import { Role } from "../../utils/role.enum"
import RoleService from "../../service/role.service"
describe('Test for getRoles', () => {


    const roleService = new RoleService;
    test('test for getRoles', async () => {
        const original = Object.values(Role);
        const result = roleService.getRoles("log")
        expect(result).toEqual(original)
    }
    )
})