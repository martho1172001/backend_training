import { ValidationError, validate } from "class-validator";
import HttpException from "./http.exception";

class HttpExceptionHandle extends HttpException {
    public errors: ValidationError[];

    constructor(status: number, message: string, errors: ValidationError[]) {
        super(status, message);
        this.errors = errors;

    }
    public formatValidationError(errors: ValidationError[]) {
        let formattedErrorObject: Object = {};
        errors.forEach((element) => {
            const errorField = element.property;
            if (element.children.length > 0) {
                formattedErrorObject[errorField] = this.formatValidationError(element.children);
                return formattedErrorObject;
            }
            else {
                formattedErrorObject[errorField] = Object.values(element.constraints);
                return formattedErrorObject;
            }
        })
        return formattedErrorObject;
    }

}

export default HttpExceptionHandle;