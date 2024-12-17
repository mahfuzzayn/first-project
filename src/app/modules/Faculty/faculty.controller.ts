import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { FacultyServices } from './faculty.service'
import httpStatus from 'http-status'

const getSingleFaculty = catchAsync(async (req, res) => {
    const { id } = req.params

    const result = await FacultyServices.getSingleFacultyFromDB(id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty retrieved successfully',
        data: result,
    })
})

const getAllFaculties = catchAsync(async (req, res) => {
    const result = await FacultyServices.getAllFacultiesFromDB(req.query)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculties retrieved successfully',
        data: result,
    })
})

const deleteFaculty = catchAsync(async (req, res) => {
    const { id } = req.params

    const result = await FacultyServices.deleteFacultyFromDB(id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty deleted successfully',
        data: result,
    })
})

const updateFaculty = catchAsync(async (req, res) => {
    const { id } = req.params
    const { faculty: updatedData } = req.body

    const result = await FacultyServices.updateFacultyIntoDB(id, updatedData)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty updated successfully',
        data: result,
    })
})

export const FacultyControllers = {
    getSingleFaculty,
    getAllFaculties,
    updateFaculty,
    deleteFaculty,
}
