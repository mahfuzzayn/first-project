import config from '../../config'
import AppError from '../../errors/AppError'
import { User } from '../User/user.model'
import { TLoginUser } from './auth.interface'
import httpStatus from 'http-status'
import { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { createToken, verifyToken } from './auth.utils'
import { sendEmail } from '../../utils/sendEmail'

const loginUser = async (payload: TLoginUser) => {
    // checking if the user is exists
    const user = await User.isUserExistsByCustomId(payload?.id)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
    }

    // // checking if the user is already deleted

    const isDeleted = user?.isDeleted

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!')
    }

    // // checking if the user is blocked

    const userStatus = user?.status

    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!')
    }

    // // checking if the password is correct

    if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password did not matched!')
    }

    // create token and sent to the client

    const jwtPayload = {
        userId: user?.id,
        role: user?.role,
    }

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    )

    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string,
    )

    // Access Token, Refresh Token

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user?.needsPasswordChange,
    }
}

const changePassword = async (
    userData: JwtPayload,
    payload: {
        oldPassword: string
        newPassword: string
    },
) => {
    // checking if the user is exists
    const user = await User.isUserExistsByCustomId(userData?.userId)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
    }

    // // checking if the user is already deleted

    const isDeleted = user?.isDeleted

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!')
    }

    // // checking if the user is blocked

    const userStatus = user?.status

    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!')
    }

    // // checking if the password is correct

    if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password did not matched!')
    }

    // hash new password

    const newHashedPassword = await bcrypt.hash(
        payload?.newPassword,
        Number(config.bcrypt_salt_rounds),
    )

    await User.findOneAndUpdate(
        {
            id: userData?.userId,
            role: userData?.role,
        },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date(),
        },
    )

    return null
}

const refreshToken = async (token: string) => {
    // check if the token is valid

    const decoded = verifyToken(token, config.jwt_refresh_secret as string)

    const { userId, iat } = decoded

    // checking if the user is exists
    const user = await User.isUserExistsByCustomId(userId)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
    }

    // // checking if the user is already deleted

    const isDeleted = user?.isDeleted

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!')
    }

    // // checking if the user is blocked

    const userStatus = user?.status

    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!')
    }

    // verify password change to update token
    if (
        user?.passwordChangedAt &&
        User.isJWTIssuedBeforePasswordChanged(
            user?.passwordChangedAt,
            iat as number,
        )
    ) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            'You are not authorized! Password has been changed',
        )
    }

    // create access token
    const jwtPayload = {
        userId: user?.id,
        role: user?.role,
    }

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    )

    return {
        accessToken,
    }
}

const forgetPassword = async (userId: string) => {
    // checking if the user is exists
    const user = await User.isUserExistsByCustomId(userId)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
    }

    // // checking if the user is already deleted

    const isDeleted = user?.isDeleted

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!')
    }

    // // checking if the user is blocked

    const userStatus = user?.status

    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!')
    }

    const jwtPayload = {
        userId: user?.id,
        role: user?.role,
    }

    const resetToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        '10m',
    )

    const resetUILink = `${config.reset_pass_ui_link}?id=${user?.id}&token=${resetToken}`

    sendEmail(user?.email, resetUILink)

    return {
        link: resetUILink,
        token: resetToken,
    }
}

const resetPassword = async (
    payload: {
        id: string
        newPassword: string
    },
    token: string,
) => {
    // checking if the user is exists
    const user = await User.isUserExistsByCustomId(payload?.id)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
    }

    // // checking if the user is already deleted

    const isDeleted = user?.isDeleted

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!')
    }

    // // checking if the user is blocked

    const userStatus = user?.status

    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!')
    }

    const decoded = verifyToken(token, config.jwt_access_secret as string)

    if (payload?.id !== decoded?.userId) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden')
    }

    const newHashedPassword = await bcrypt.hash(
        payload?.newPassword,
        Number(config.bcrypt_salt_rounds),
    )

    await User.findOneAndUpdate(
        {
            id: decoded?.userId,
            role: decoded?.role,
        },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date(),
        },
    )
}

export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
}
