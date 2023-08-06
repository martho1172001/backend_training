
import express, { NextFunction } from "express";
import authenticate from "../middleware/authenticate.middleware";
import authorize from "../middleware/authorize.middleware";
import { Role } from "../utils/role.enum";
import RoleService from "../service/role.service";
import RequestWithUser from "../utils/RequestWithUser";
import logger from "../logging/winston.log";

class RoleController{
    public router: express.Router;
   constructor(private roleService:RoleService){
    this.router= express.Router();
    this.router.get("/",this.getRoles);
   }

getRoles=async (req: RequestWithUser, res: express.Response, next: NextFunction)=>{
    const start= Number(req.startTime);
    const logStart = `[${req.traceId}] /roles${req.url} : ${req.method} :`;
    const roles= this.roleService.getRoles(logStart);

    logger.info(`${logStart} Roles retrieval successful `);
    logger.info(`${logStart} Request completed `);  
    res.status(200).send({data:roles,errors:null,message:"OK",meta:{length:roles.length,took: Date.now()-start,total:roles.length}});
           

}

}
export default RoleController;