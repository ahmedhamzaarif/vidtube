import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    let error = err

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || error instanceof mongoose.Error ? 400 : 500 

        const message = error.message || "Something went wrong"
        error = new ApiError(statusCode, message, error?.errors || [], err.stack)
    }

    const response = {
        ...error,
        message: error?.messages,
        ...(process.env.NODE_ENV === "developement" ? {stack: error.stack} : {})
    }

    return res.status(err.statusCode).json(response)
}

export {errorHandler}