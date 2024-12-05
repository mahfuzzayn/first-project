import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import { AcademicSemesterServices } from './academicSemester.service'
import sendResponse from '../../utils/sendResponse'

const createAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
        req.body,
    )

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Semester is Created Successfully',
        data: result,
    })
})

const getAllAcademicSemesters = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.getAllAcademicSemesterFromDB()

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Retrieved all Academic Semesters Successfully',
        data: result,
    })
})

const getSingleAcademicSemester = catchAsync(async (req, res) => {
    const { semesterId } = req.params

    const result =
        await AcademicSemesterServices.getSingleAcademicSemesterFromDB(
            semesterId,
        )

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Retrieved Academic Semester Successfully',
        data: result,
    })
})

const updateAcademicSemester = catchAsync(async (req, res) => {
    const { semesterId } = req.params

    const result = await AcademicSemesterServices.updateAcademicSemesterFromDB(
        semesterId,
        req.body,
    )

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Updated Academic Semester Successfully',
        data: result,
    })
})

export const AcademicSemesterControllers = {
    createAcademicSemester,
    getAllAcademicSemesters,
    getSingleAcademicSemester,
    updateAcademicSemester,
}
