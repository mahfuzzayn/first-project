import { StudentServices } from './student.service'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'

const getSingleStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params

    const result = await StudentServices.getSingleStudentFromDB(studentId)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student retrieved successfully',
        data: result,
    })
})

const getAllStudents = catchAsync(async (req, res) => {
    const result = await StudentServices.getAllStudentsFromDB()

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Students are retrieved successfully',
        data: result,
    })
})

const deleteStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params

    const result = await StudentServices.deleteStudentFromDB(studentId)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is deleted successfully',
        data: result,
    })
})

const updateStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params
    const { student: updatedData } = req.body
    
    const result = await StudentServices.updateStudentIntoDB(
        studentId,
        updatedData,
    )

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is updated successfully',
        data: result,
    })
})

export const studentControllers = {
    getAllStudents,
    getSingleStudent,
    deleteStudent,
    updateStudent,
}
