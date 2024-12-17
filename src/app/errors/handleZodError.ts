import { ZodError } from "zod"
import { TErrorResources } from "../interface/error"

const handleZodError = (error: ZodError) => {
    const statusCode = 400
    const errorSources: TErrorResources = error.issues.map(issue => {
        return {
            path: issue?.path[issue.path.length - 1],
            message: issue?.message,
        }
    })

    return {
        statusCode,
        message: 'Validation Error',
        errorSources,
    }
}

export default handleZodError