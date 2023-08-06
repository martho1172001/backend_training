import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { RequestWithUser } from "../utils/requestWithUser";
import { jwtPayload } from "../utils/jwtPayloadtype";

const authenticate = async( req: RequestWithUser, res: Response, next: NextFunction)=>{
    try{
       const token = getTokenFromRequestHeader(req);
      const payload= jsonwebtoken.verify(token,process.env.JWT_SECRETKEY)as jwtPayload;
      req.name=payload.name;
      req.username=payload.username;
      req.role=payload.role
      next();

    }catch(error){
        next(error)
    }

}

const getTokenFromRequestHeader = (req:Request)=>{
    const bearerToken=req.header("Authorization");
    const token = bearerToken?bearerToken.replace("Bearer ",""):"";
    return token;

}

export default authenticate;