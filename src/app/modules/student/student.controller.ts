/* eslint-disable @typescript-eslint/no-explicit-any */
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
    message: 'Student is created successfully',
    data: result,
  })
})

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB()

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is created successfully',
    data: result,
  })
})

const deleteStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params

  const result = await StudentServices.deleteStudentFromDB(studentId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is created successfully',
    data: result,
  })
})

const updateStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params
  const { student: updatedData } = req.body

  const result = await StudentServices.updateStudentFromDB(
    studentId,
    updatedData,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is created successfully',
    data: result,
  })
})

export const studentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateStudent,
}
