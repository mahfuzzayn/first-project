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
    return lastStudent?.id ? lastStudent.id.substring(6) : undefined
}

export const generateStudentId = async (payload: TAcademicSemester | null) => {
    if (!payload) {
        throw new Error("Admission semester is invalid.");
    }

    const currentId = (await findLastStudentId()) || (0).toString()
    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0')
    incrementId = `${payload.year}${payload.code}${incrementId}`
    return incrementId
}
