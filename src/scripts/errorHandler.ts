interface PrismaError {
    code?: string;
    meta?: {
        target?: string[];
        field_name?: string;
    }
    clientVersion?: string;
    message?: string;
}

import {ErrorMessage} from '../models/types/types';

export function errorHandler (err: any): ErrorMessage {
    let errorMessage: ErrorMessage = "Something went wrong.";
    console.log(err)

    if (typeof err === "object") {
        const error = err as PrismaError;

        if (error.code === "P2001") {
            console.log(error)
            errorMessage = "Can't find a matching record." as ErrorMessage;
        } else if (error.code === "P2002") {
            console.log(error)
            errorMessage = `${error.meta?.target?.[0]} already exists.` as ErrorMessage;
        } else if (error.code === "P2003") {
            console.log(error)
            errorMessage = `${error.meta?.target?.[0]} does not exist.` as ErrorMessage;
        }
    }
    return errorMessage as ErrorMessage;
}