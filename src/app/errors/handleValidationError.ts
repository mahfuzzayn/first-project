import mongoose from 'mongoose'
import { TErrorResources, TGenericErrorResponse } from '../interface/error'

const handleValidationError = (
    error: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
    const errorSources: TErrorResources = Object.values(error.errors).map(
        (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
            return {
                path: val?.path,
                message: val?.message,
            }
        },
    )

    const statusCode = 400

    return {
        statusCode,
        message: 'Validation Error',
        errorSources,
    }
}

export default handleValidationError
