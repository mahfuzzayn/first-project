export type TErrorResources = {
    path: string | number
    message: string
}[]

export type TGenericErrorResponse = {
    statusCode: number
    message: string
    errorSources: TErrorResources
}