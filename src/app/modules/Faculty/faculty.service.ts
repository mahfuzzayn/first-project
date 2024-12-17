/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import { facultySearchableFields } from './faculty.const'
import { TFaculty } from './faculty.interface'
import { Faculty } from './faculty.model'
import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { User } from '../user/user.model'

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
    const facultyQuery = new QueryBuilder(
        Faculty.find().populate({
            path: 'academicDepartment',
            populate: {
                path: 'academicFaculty',
            },
        }),
        query,
    )
        .search(facultySearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await facultyQuery.modelQuery

    return result
}

const getSingleFacultyFromDB = async (id: string) => {
    const result = await Faculty.findOne({ id }).populate({
        path: 'academicDepartment',
        populate: {
            path: 'academicFaculty',
        },
    })

    return result
}

const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
    const { name, ...remainingFacultyData } = payload

    const modifiedUpdatedData: Record<string, unknown> = {
        ...remainingFacultyData,
    }

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value
        }
    }

    const result = await Faculty.findOneAndUpdate({ id }, modifiedUpdatedData)

    return result
}

const deleteFacultyFromDB = async (id: string) => {
    const session = await mongoose.startSession()

    if (!(await Faculty.isUserExists(id))) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Faculty does not exist')
    }

    try {
        session.startTransaction()

        const deletedFaculty = await Faculty.findOneAndUpdate(
            {
                id,
            },
            {
                isDeleted: true,
            },
            {
                new: true,
                session,
            },
        )

        if (!deletedFaculty) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to delete faculty',
            )
        }

        const deletedUser = await User.findOneAndUpdate(
            { id },
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

        return deletedFaculty
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()

        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete faculty')
    }
}

export const FacultyServices = {
    getAllFacultiesFromDB,
    getSingleFacultyFromDB,
    updateFacultyIntoDB,
    deleteFacultyFromDB,
}
