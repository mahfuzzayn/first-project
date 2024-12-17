import mongoose from 'mongoose'
import { TErrorResources, TGenericErrorResponse } from '../interface/error'

const handleCastError = (
    error: mongoose.Error.CastError,
): TGenericErrorResponse => {
    const errorSources: TErrorResources = [
        {
            path: error?.path,
            message: error?.message,
        },
    ]
    const statusCode = 400

    return {
        statusCode,
        message: 'Invalid ID',
        errorSources,
    }
}

export default handleCastError
