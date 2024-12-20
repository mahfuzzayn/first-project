import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import AppError from '../errors/AppError'
import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config'
import { TUserRole } from '../modules/user/user.interface'
import { User } from '../modules/user/user.model'

const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const token = req.headers.authorization

            // if the token is send from the client
            if (!token) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'You are not authorized!',
                )
            }
            // check if the token is valid

            const decoded = jwt.verify(
                token,
                config.jwt_access_secret as string,
            ) as JwtPayload

            const { userId, role, iat } = decoded

            // checking if the user is exists
            const user = await User.isUserExistsByCustomId(userId)

            if (!user) {
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    'This user is not found!',
                )
            }

            // // checking if the user is already deleted

            const isDeleted = user?.isDeleted

            if (isDeleted) {
                throw new AppError(
                    httpStatus.FORBIDDEN,
                    'This user is deleted!',
                )
            }

            // // checking if the user is blocked

            const userStatus = user?.status

            if (userStatus === 'blocked') {
                throw new AppError(
                    httpStatus.FORBIDDEN,
                    'This user is blocked!',
                )
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

            if (requiredRoles && !requiredRoles.includes(role)) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'You are not authorized!',
                )
            }

            req.user = decoded as JwtPayload
            next()
        },
    )
}

export default auth