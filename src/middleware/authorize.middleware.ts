import { NextFunction, Response } from "express"
import RequestWithUser from "../utils/RequestWithUser"
import { Role } from "../utils/role.enum";
import HttpException from "../exception/http.exception";

const authorize = (allowedRoles: Role[]) => async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = req.role;
    if (!allowedRoles.includes(role)) {
      throw new HttpException(403, 'You have no access');
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default authorize;