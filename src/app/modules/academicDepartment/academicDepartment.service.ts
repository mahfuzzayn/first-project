import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { AcademicFaculty } from '../AcademicFaculty/academicFaculty.model'
import { academicDepartmentSearchableFields } from './academicDepartment.const'
import { TAcademicDepartment } from './academicDepartment.interface'
import { AcademicDepartment } from './academicDepartment.model'
import httpStatus from 'http-status'

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
    const isAcademicDepartmentExists = await AcademicDepartment.findOne({
        name: payload.name,
    })

    if (isAcademicDepartmentExists) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'This department exists already',
        )
    }

    const isAcademicFacultyExists = await AcademicFaculty.findById(
        payload?.academicFaculty,
    )

    if (!isAcademicFacultyExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found!')
    }

    const result = await AcademicDepartment.create(payload)

    return result
}

const getAllAcademicDepartmentsFromDB = async (
    query: Record<string, unknown>,
) => {
    const academicDepartmentsQuery = new QueryBuilder(
        AcademicDepartment.find().populate('academicFaculty'),
        query,
    )
        .search(academicDepartmentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await academicDepartmentsQuery.modelQuery
    const meta = await academicDepartmentsQuery.countTotal()

    return { meta, result }
}

const getSingleAcademicDepartmentFromDB = async (departmentId: string) => {
    const result =
        await AcademicDepartment.findById(departmentId).populate(
            'academicFaculty',
        )

    return result
}

const updateAcademicDepartmentIntoDB = async (
    departmentId: string,
    payload: Partial<TAcademicDepartment>,
) => {
    if (payload?.academicFaculty) {
        const isAcademicFacultyExists = await AcademicFaculty.findById(
            payload?.academicFaculty,
        )

        if (!isAcademicFacultyExists) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                'Academic Faculty not found!',
            )
        }
    }

    const result = await AcademicDepartment.findByIdAndUpdate(
        departmentId,
        payload,
    )

    return result
}

export const AcademicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    getAllAcademicDepartmentsFromDB,
    getSingleAcademicDepartmentFromDB,
    updateAcademicDepartmentIntoDB,
}
