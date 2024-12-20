/* eslint-disable @typescript-eslint/no-unused-vars */
import { Student } from './student.model'
import { TStudent } from './student.interface'
import mongoose from 'mongoose'
import { User } from '../user/user.model'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'
import QueryBuilder from '../../builder/QueryBuilder'
import { studentSearchableFields } from './student.const'

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
    // const queryObj = { ...query }

    // // Filtering
    // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields']

    // excludeFields.forEach(el => delete queryObj[el])

    // let searchTerm: string = ''

    // if (query?.searchTerm) {
    //     searchTerm = query?.searchTerm as string
    // }

    // const searchQuery = Student.find({
    //     $or: studentSearchableFields.map(field => ({
    //         [field]: { $regex: searchTerm, $options: 'i' },
    //     })),
    // })

    // const filterQuery = searchQuery.find(queryObj)

    // let sort = '-createdAt'

    // if (query?.sort) {
    //     sort = query?.sort as string
    // }

    // const sortQuery = filterQuery.sort(sort)

    // let page: number = 1
    // let limit: number = 0
    // let skip: number = 0

    // if (query?.limit) {
    //     limit = query?.limit as number
    // }

    // if (query?.page) {
    //     page = query?.page as number
    //     skip = (page - 1) * limit
    // }

    // const paginateQuery = sortQuery.skip(skip)

    // const limitQuery = paginateQuery.limit(limit)

    // let fields = '-__v'

    // // fields: 'name,email';
    // // fields: query

    // if (query?.fields) {
    //     fields = (query?.fields as string).split(',').join(' ')
    // }

    // const fieldQUery = limitQuery.select(fields)

    // const result = await fieldQUery.populate('admissionSemester').populate({
    //     path: 'academicDepartment',
    //     populate: {
    //         path: 'academicFaculty',
    //     },
    // })

    // return result

    const studentQuery = new QueryBuilder(
        Student.find()
            .populate('user')
            .populate('admissionSemester')
            .populate({
                path: 'academicDepartment',
                populate: {
                    path: 'academicFaculty',
                },
            }),
        query,
    )
        .search(studentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await studentQuery.modelQuery

    return result
}

const getSingleStudentFromDB = async (id: string) => {
    const result = await Student.findOne({ id })
        .populate('admissionSemester')
        .populate({
            path: 'academicDepartment',
            populate: {
                path: 'academicFaculty',
            },
        })

    return result
}

const deleteStudentFromDB = async (id: string) => {
    const session = await mongoose.startSession()

    if (!(await Student.isUserExists(id))) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Student does not exist')
    }

    try {
        session.startTransaction()

        const deletedStudent = await Student.findOneAndUpdate(
            { id },
            {
                isDeleted: true,
            },
            { new: true, session },
        )

        if (!deletedStudent) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to delete student',
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

        return deletedStudent
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()

        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student')
    }
}

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
    const { name, guardian, localGuardian, ...remainingStudentData } = payload

    const modifiedUpdatedData: Record<string, unknown> = {
        ...remainingStudentData,
    }

    /*
        guardian: {
            fatherOccupation: "Teacher"
        }

        guardian.fatherOccupation = "Teacher"

        name.firstName = 'Mezba'
        name.lastName = 'Abedin
    */

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value
        }
    }

    if (guardian && Object.keys(guardian).length) {
        for (const [key, value] of Object.entries(guardian)) {
            modifiedUpdatedData[`guardian.${key}`] = value
        }
    }

    if (localGuardian && Object.keys(localGuardian).length) {
        for (const [key, value] of Object.entries(localGuardian)) {
            modifiedUpdatedData[`localGuardian.${key}`] = value
        }
    }

    const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData)

    return result
}

export const StudentServices = {
    getAllStudentsFromDB,
    getSingleStudentFromDB,
    deleteStudentFromDB,
    updateStudentIntoDB,
}
