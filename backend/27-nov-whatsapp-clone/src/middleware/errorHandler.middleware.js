import { StatusCodes } from "http-status-codes"
import { buildFailureResponse } from "../shared/utils/buildFailuerResponse.js";

const errorMiddleware = (err, req, res, next) => {
    const errMessage = err.message;
    // const errName = err.name;
    const errStatus = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    
    buildFailureResponse(res, errMessage, errStatus)
}

export default errorMiddleware;