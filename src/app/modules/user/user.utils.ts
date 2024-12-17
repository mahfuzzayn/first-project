import AppError from '../../errors/AppError'
import { TAcademicSemester } from '../academicSemester/academicSemester.interface'
import { User } from './user.model'

const findLastStudentId = async () => {
    const lastStudent = await User.findOne(
        {
            role: 'student',
        },
        {
            _id: 0,
            id: 1,
        },
    )
        .sort({
            createdAt: -1,
        })
        .lean()

    // 203001 0001
    return lastStudent?.id ? lastStudent.id : undefined
}

const findLastFacultyId = async () => {
    const lastFaculty = await User.findOne(
        {
            role: 'faculty',
        },
        {
            _id: 0,
            id: 1,
        },
    )
        .sort({ createdAt: -1 })
        .lean()

    return lastFaculty?.id ? lastFaculty.id : undefined
}

const findLastAdminId = async () => {
    const lastAdmin = await User.findOne(
        {
            role: 'admin',
        },
        {
            _id: 0,
            id: 1,
        },
    )
        .sort({ createdAt: -1 })
        .lean()

    return lastAdmin?.id ? lastAdmin.id : undefined
}

export const generateStudentId = async (payload: TAcademicSemester | null) => {
    if (!payload) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Admission semester is invalid.',
        )
    }

    let currentId = (0).toString() // 0000 by default

    const lastStudentId = await findLastStudentId()
    const lastStudentSemesterCode = lastStudentId?.substring(4, 6)
    const lastStudentYear = lastStudentId?.substring(0, 4)
    const currentSemesterCode = payload.code
    const currentYear = payload.year

    if (
        lastStudentId &&
        lastStudentSemesterCode === currentSemesterCode &&
        lastStudentYear === currentYear
    ) {
        currentId = lastStudentId.substring(6) // 0001
    }

    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0')
    incrementId = `${payload.year}${payload.code}${incrementId}`
    return incrementId
}

export const generateFacultyId = async () => {
    let currentId = (0).toString()

    const lastFacultyId = await findLastFacultyId()

    if (lastFacultyId) {
        currentId = lastFacultyId.substring(5) // F-0001
    }

    const incrementId = (Number(currentId) + 1).toString().padStart(4, '0')

    return `F-${incrementId}`
}

export const generateAdminId = async () => {
    let currentId = (0).toString()

    const lastAdminId = await findLastAdminId()

    if (lastAdminId) {
        currentId = lastAdminId.substring(5) // A-0001
    }

    const incrementId = (Number(currentId) + 1).toString().padStart(4, '0')

    return `A-${incrementId}`
}
