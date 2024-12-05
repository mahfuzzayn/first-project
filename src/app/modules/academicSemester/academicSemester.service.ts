import { TAcademicSemester } from './academicSemester.interface'
import { AcademicSemester } from './academicSemester.model'
import { academicSemesterNameCodeMapper } from './academicSemester.constant'

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new Error('Invalid Semester Code')
    }

    const result = await AcademicSemester.create(payload)

    return result
}

const getAllAcademicSemesterFromDB = async () => {
    const result = await AcademicSemester.find()
    return result
}

const getSingleAcademicSemesterFromDB = async (semesterId: string) => {
    const result = await AcademicSemester.findById(semesterId)
    return result
}

const updateAcademicSemesterFromDB = async (
    semesterId: string,
    payload: Partial<TAcademicSemester>,
) => {
    if (
        academicSemesterNameCodeMapper[payload.name as string] !== payload.code
    ) {
        throw new Error('Invalid semester code. Failed to update the semester')
    }

    const result = await AcademicSemester.findByIdAndUpdate(semesterId, payload)

    return result
}

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    getAllAcademicSemesterFromDB,
    getSingleAcademicSemesterFromDB,
    updateAcademicSemesterFromDB,
}
