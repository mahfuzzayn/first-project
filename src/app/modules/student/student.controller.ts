import { Request, Response } from 'express'
import { StudentServices } from './student.service'
import studentValidationSchema from './students.validation'

const createStudent = async (req: Request, res: Response) => {
  try {
    // creating a schema validation using zod

    const { student: studentData } = req.body

    // data validation using Joi
    // const { error, value } = studentValidationSchema.validate(studentData)

    // data validation using zod

    const zodParsedData = studentValidationSchema.parse(studentData)

    // will call service function to send this data
    const result = await StudentServices.createStudentIntoDB(zodParsedData)

    // send response
    res.status(200).json({
      success: true,
      message: 'Student is created successfully',
      data: result,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
      error: error,
    })
  }
}

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB()

    res.status(200).json({
      success: true,
      message: 'Students is retrieved successfully',
      data: result,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
      error: error,
    })
  }
}

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params

    const result = await StudentServices.getSingleStudentFromDB(studentId)

    res.status(200).json({
      success: true,
      message: 'A student is retrieved successfully',
      data: result,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
      error: error,
    })
  }
}

const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params

    const result = await StudentServices.deleteStudentFromDB(studentId)

    res.status(200).json({
      success: true,
      message: 'Student is deleted successfully',
      data: result,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
      error: error,
    })
  }
}

const updateStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params
    const { student: updatedData } = req.body

    const result = await StudentServices.updateStudentFromDB(
      studentId,
      updatedData,
    )

    res.status(200).json({
      success: true,
      message: 'Student is updated successfully',
      data: result,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
      error: error,
    })
  }
}

export const studentControllers = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateStudent,
}
