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
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary'

const createStudentIntoDB = async (
    file: any,
    password: string,
    payload: TStudent,
) => {
    // create a user object
    const userData: Partial<TUser> = {}

    // if password is not given, use default password
    userData.password = password || (config.default_password as string)

    // set student role
    userData.role = 'student'

    // set student email
    userData.email = payload?.email

    // find academic semester info
    const admissionSemester = await AcademicSemester.findById(
        payload.admissionSemester,
    )

    const session = await mongoose.startSession()

    try {
        session.startTransaction()
        //set  generated id
        userData.id = await generateStudentId(admissionSemester)

        // Send image to cloudinary
        const imageName = `${userData.id}-${payload?.name?.firstName}`
        const path = file?.path

        const uploadedProfileImgToCloudinary: any = await sendImageToCloudinary(
            imageName,
            path,
        )

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
        payload.profileImg = uploadedProfileImgToCloudinary?.secure_url

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

const createFacultyIntoDB = async (
    file: any,
    password: string,
    payload: TFaculty,
) => {
    const userData: Partial<TUser> = {}

    userData.password = password || (config.default_password as string)

    userData.role = 'faculty'

    userData.email = payload?.email

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        userData.id = await generateFacultyId()

        const imageName = `${userData.id}-${payload?.name?.firstName}`
        const path = file?.path

        const uploadedProfileImgToCloudinary: any = await sendImageToCloudinary(
            imageName,
            path,
        )

        const newUser = await User.create([userData], { session })

        if (!newUser.length) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to create an user',
            )
        }

        payload.id = newUser[0].id
        payload.user = newUser[0]._id
        payload.profileImg = uploadedProfileImgToCloudinary?.secure_url

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

const createAdminIntoDB = async (
    file: any,
    password: string,
    payload: TAdmin,
) => {
    const userData: Partial<TUser> = {}

    userData.password = password || (config.default_password as string)

    userData.role = 'admin'

    userData.email = payload?.email

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        userData.id = await generateAdminId()

        const imageName = `${userData.id}-${payload?.name?.firstName}`
        const path = file?.path

        const uploadedProfileImgToCloudinary: any = await sendImageToCloudinary(
            imageName,
            path,
        )

        const newUser = await User.create([userData], { session })

        if (!newUser.length) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to create an user',
            )
        }

        payload.id = newUser[0].id
        payload.user = newUser[0]._id
        payload.profileImg = uploadedProfileImgToCloudinary?.secure_url

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

const getMeFromDB = async (userId: string, role: string) => {
    let result = null

    if (role === 'student') {
        result = await Student.findOne({ id: userId })
            .populate('user')
            .populate('admissionSemester')
            .populate({
                path: 'academicDepartment',
                populate: {
                    path: 'academicFaculty',
                },
            })
    }
    if (role === 'faculty') {
        result = await Faculty.findOne({ id: userId })
            .populate('user')
            .populate({
                path: 'academicDepartment',
                populate: {
                    path: 'academicFaculty',
                },
            })
    }
    if (role === 'admin') {
        result = await Admin.findOne({ id: userId })
            .populate('user')
            .populate({
                path: 'managementDepartment',
                populate: {
                    path: 'academicFaculty',
                },
            })
    }

    return result
}

const changeStatusIntoDB = async (
    id: string,
    payload: {
        status: string
    },
) => {
    const result = await User.findByIdAndUpdate(id, payload, {
        new: true,
    })

    return result
}

export const UserServices = {
    createStudentIntoDB,
    createFacultyIntoDB,
    createAdminIntoDB,
    getMeFromDB,
    changeStatusIntoDB,
}
