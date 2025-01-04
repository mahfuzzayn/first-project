import catchAsync from '../../utils/catchAsync'
import { AcademicDepartmentServices } from './academicDepartment.service'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'

const createAcademicDepartment = catchAsync(async (req, res) => {
    const result =
        await AcademicDepartmentServices.createAcademicDepartmentIntoDB(
            req.body,
        )

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic department is created successfully',
        data: result,
    })
})

const getAllAcademicDepartments = catchAsync(async (req, res) => {
    const result =
        await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB(
            req.query,
        )

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic departments retrieved successfully',
        meta: result?.meta,
        data: result?.result,
    })
})

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
    const { departmentId } = req.params

    const result =
        await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(
            departmentId,
        )

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic department retrieved successfully',
        data: result,
    })
})

const updateAcademicDepartment = catchAsync(async (req, res) => {
    const { departmentId } = req.params

    const result =
        await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(
            departmentId,
            req.body,
        )

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic department updated successfully',
        data: result,
    })
})

export const AcademicDepartmentControllers = {
    createAcademicDepartment,
    getAllAcademicDepartments,
    getSingleAcademicDepartment,
    updateAcademicDepartment,
}
