/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"

const globalErrorHandler = ((error: any, req: Request, res: Response, next: NextFunction): any => {
  const statusCode = 500
  const message = error.message || 'something went wrong!'

  return res.status(statusCode).json({
    success: false,
    message,
    error,
  })
})

export default globalErrorHandler;
