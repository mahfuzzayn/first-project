import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { EnrolledCourseServices } from './enrolledCourse.service'
import httpStatus from 'http-status'

const createEnrolledCourse = catchAsync(async (req, res) => {
    const { userId } = req.user

    const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
        userId,
        req.body,
    )

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is enrolled successfully',
        data: result,
    })
})

const getAllEnrolledCourses = catchAsync(async (req, res) => {
    const result = await EnrolledCourseServices.getAllEnrolledCoursesFromDB(
        req.query,
    )

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Enrolled Courses retrieved successfully',
        meta: result?.meta,
        data: result?.result,
    })
})

const getSingleEnrolledCourse = catchAsync(async (req, res) => {
    const { id: enrolledCourseId } = req.params

    const result =
        await EnrolledCourseServices.getSingleEnrolledCourseFromDB(
            enrolledCourseId,
        )

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Enrolled Courses retrieved successfully',
        data: result,
    })
})

const getMyEnrolledCourse = catchAsync(async (req, res) => {
    const { userId: studentId } = req.user

    const result = await EnrolledCourseServices.getMyEnrolledCoursesFromDB(
        studentId,
        req.query,
    )

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Enrolled Courses retrieved successfully',
        data: result,
    })
})

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
    const { userId: facultyId } = req.user

    const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(
        facultyId,
        req.body,
    )

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course marks is updated successfully',
        data: result,
    })
})

export const EnrolledCourseControllers = {
    createEnrolledCourse,
    getAllEnrolledCourses,
    getSingleEnrolledCourse,
    getMyEnrolledCourse,
    updateEnrolledCourseMarks,
}
