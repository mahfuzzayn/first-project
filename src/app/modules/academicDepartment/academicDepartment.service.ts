import AppError from '../../errors/AppError'
import { TAcademicDepartment } from './academicDepartment.interface'
import { AcademicDepartment } from './academicDepartment.model'
import httpStatus from 'http-status'

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
    // const isDepartmentExist = await AcademicDepartment.findOne({
    //     name: payload.name,
    // })

    // if (isDepartmentExist) {
    //     throw new AppError(
    //         httpStatus.NOT_FOUND,
    //         'This department exists already',
    //     )
    // }

    const result = await AcademicDepartment.create(payload)

    return result
}

const getAllAcademicDepartmentsFromDB = async () => {
    const result = await AcademicDepartment.find().populate('academicFaculty')

    return result
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
