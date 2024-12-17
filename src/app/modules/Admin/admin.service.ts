/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import { adminSearchableFields } from './admin.const'
import { TAdmin } from './admin.interface'
import { Admin } from './admin.model'
import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { User } from '../user/user.model'

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
    const AdminQuery = new QueryBuilder(
        Admin.find().populate({
            path: 'managementDepartment',
            populate: {
                path: 'academicFaculty',
            },
        }),
        query,
    )
        .search(adminSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await AdminQuery.modelQuery

    return result
}

const getSingleAdminFromDB = async (id: string) => {
    const result = await Admin.findById(id).populate({
        path: 'managementDepartment',
        populate: {
            path: 'academicFaculty',
        },
    })

    return result
}

const updateAdminIntoDB = async (id: string, payload: Partial<TAdmin>) => {
    const { name, ...remainingAdminData } = payload

    const modifiedUpdatedData: Record<string, unknown> = {
        ...remainingAdminData,
    }

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value
        }
    }

    const result = await Admin.findByIdAndUpdate(id, modifiedUpdatedData)

    return result
}

const deleteAdminFromDB = async (id: string) => {
    const session = await mongoose.startSession()

    if (!(await Admin.isUserExists(id))) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Admin does not exist')
    }

    try {
        session.startTransaction()

        const deletedAdmin = await Admin.findByIdAndUpdate(
            id,
            {
                isDeleted: true,
            },
            {
                new: true,
                session,
            },
        )

        if (!deletedAdmin) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete admin')
        }

        const userId = deletedAdmin.user

        const deletedUser = await User.findByIdAndUpdate(
            userId,
            {
                isDeleted: true,
            },
            { new: true, session },
        )

        if (!deletedUser) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user')
        }

        await session.commitTransaction()
        await session.endSession()

        return deletedAdmin
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()

        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete admin')
    }
}

export const AdminServices = {
    getAllAdminsFromDB,
    getSingleAdminFromDB,
    updateAdminIntoDB,
    deleteAdminFromDB,
}
