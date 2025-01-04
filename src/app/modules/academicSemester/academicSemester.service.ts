import { TAcademicSemester } from './academicSemester.interface'
import { AcademicSemester } from './academicSemester.model'
import { academicSemesterNameCodeMapper } from './academicSemester.const'
import AppError from '../../errors/AppError'
import QueryBuilder from '../../builder/QueryBuilder'

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new AppError(httpStatus.NOT_FOUND, 'Invalid Semester Code')
    }

    const result = await AcademicSemester.create(payload)

    return result
}

const getAllAcademicSemesterFromDB = async (query: Record<string, unknown>) => {
    const academicSemesterQuery = new QueryBuilder(
        AcademicSemester.find(),
        query,
    )

    const result = await academicSemesterQuery.modelQuery
    const meta = await academicSemesterQuery.countTotal()

    return { meta, result }
}

const getSingleAcademicSemesterFromDB = async (semesterId: string) => {
    const result = await AcademicSemester.findById(semesterId)
    return result
}

const updateAcademicSemesterIntoDB = async (
    semesterId: string,
    payload: Partial<TAcademicSemester>,
) => {
    if (
        academicSemesterNameCodeMapper[payload.name as string] !== payload.code
    ) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Invalid semester code. Failed to update the semester',
        )
    }

    const result = await AcademicSemester.findByIdAndUpdate(semesterId, payload)

    return result
}

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    getAllAcademicSemesterFromDB,
    getSingleAcademicSemesterFromDB,
    updateAcademicSemesterFromDB: updateAcademicSemesterIntoDB,
}
