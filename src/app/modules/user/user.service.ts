/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config'
import { TStudent } from '../student/student.interface'
import { Student } from '../student/student.model'
import { AcademicSemester } from '../academicSemester/academicSemester.model'
import { TUser } from './user.interface'
import { User } from './user.model'
import {
    generateAdminId,
    generateFacultyId,
    generateStudentId,
} from './user.utils'
import mongoose from 'mongoose'
import AppError from '../../errors/AppError'
import { TFaculty } from '../Faculty/faculty.interface'
import { Faculty } from '../Faculty/faculty.model'
import { TAdmin } from '../Admin/admin.interface'
import { Admin } from '../Admin/admin.model'

const createStudentIntoDB = async (password: string, payload: TStudent) => {
    // create a user object
    const userData: Partial<TUser> = {}

    // if password is not given, use default password
    userData.password = password || (config.default_password as string)

    // set student role
    userData.role = 'student'

    // find academic semester info
    const admissionSemester = await AcademicSemester.findById(
        payload.admissionSemester,
    )

    const session = await mongoose.startSession()

    try {
        session.startTransaction()
        //set  generated id
        userData.id = await generateStudentId(admissionSemester)

        // create a user (transaction-1)
        const newUser = await User.create([userData], { session }) // array

        // create a student
        if (!newUser.length) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to create an user',
            )
        }

        // set id, _id as user
        payload.id = newUser[0].id // embedding id
        payload.user = newUser[0]._id // reference _id

        // create a student (transaction-2)
        const newStudent = await Student.create([payload], { session })

        if (!newStudent.length) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to create a student',
            )
        }

        await session.commitTransaction()
        await session.endSession()

        return newStudent
    } catch (error: any) {
        await session.abortTransaction()
        await session.endSession()

        throw new Error(error)
    }
}

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
    const userData: Partial<TUser> = {}

    userData.password = password || (config.default_password as string)

    userData.role = 'faculty'

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        userData.id = await generateFacultyId()

        const newUser = await User.create([userData], { session })

        if (!newUser.length) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to create an user',
            )
        }

        payload.id = newUser[0].id
        payload.user = newUser[0]._id

        const newFaculty = await Faculty.create([payload], { session })

        if (!newFaculty.length) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to create a faculty',
            )
        }

        await session.commitTransaction()
        await session.endSession()

        return newFaculty
    } catch (error: any) {
        await session.abortTransaction()
        await session.endSession()

        throw new Error(error)
    }
}

const createAdminIntoDB = async (password: string, payload: TAdmin) => {
    const userData: Partial<TUser> = {}

    userData.password = password || (config.default_password as string)

    userData.role = 'admin'

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        userData.id = await generateAdminId()

        const newUser = await User.create([userData], { session })

        if (!newUser.length) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to create an user',
            )
        }

        payload.id = newUser[0].id
        payload.user = newUser[0]._id

        const newAdmin = await Admin.create([payload], { session })

        if (!newAdmin.length) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to create an admin',
            )
        }

        await session.commitTransaction()
        await session.endSession()

        return newAdmin
    } catch (error: any) {
        await session.abortTransaction()
        await session.endSession()

        throw new Error(error)
    }
}

export const UserServices = {
    createStudentIntoDB,
    createFacultyIntoDB,
    createAdminIntoDB,
}
