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
