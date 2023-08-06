
import express, { NextFunction } from "express";
import authenticate from "../middleware/authenticate.middleware";
import authorize from "../middleware/authorize.middleware";
import { Role } from "../utils/role.enum";
import RoleService from "../service/role.service";

class RoleController{
    public router: express.Router;
   constructor(private roleService:RoleService){
    this.router= express.Router();
    this.router.get("/",this.getRoles);
   }

getRoles=async (req: express.Request, res: express.Response, next: NextFunction)=>{
   
    const roles= this.roleService.getRoles();
    
    res.status(200).send({data:roles,errors:null,message:"OK",meta:{length:roles.length,total:roles.length}});
           

}

}
export default RoleController;