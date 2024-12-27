import config from '../../config'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AuthServices } from './auth.service'
import httpStatus from 'http-status'

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body)
    const { accessToken, refreshToken, needsPasswordChange } = result

    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production' ? true : false,
        httpOnly: true,
    })

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is logged in successfully',
        data: {
            accessToken,
            needsPasswordChange,
        },
    })
})

const changePassword = catchAsync(async (req, res) => {
    const { ...passwordData } = req.body

    const result = await AuthServices.changePassword(req.user, passwordData)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password is updated successfully',
        data: result,
    })
})

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies
    const result = await AuthServices.refreshToken(refreshToken)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Access token retrieved successfully',
        data: result,
    })
})

const forgetPassword = catchAsync(async (req, res) => {
    const { id } = req.body
    const result = await AuthServices.forgetPassword(id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Reset link is generated successfully!',
        data: result,
    })
})

const resetPassword = catchAsync(async (req, res) => {
    const token = req.headers.authorization

    const result = await AuthServices.resetPassword(req.body, token as string)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password reset successful!',
        data: result,
    })
})

export const AuthControllers = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
}
