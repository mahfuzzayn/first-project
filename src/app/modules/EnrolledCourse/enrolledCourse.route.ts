import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { EnrolledCourseValidations } from './enrolledCourse.validation'
import { EnrolledCourseControllers } from './enrolledCourse.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../User/user.const'

const router = express.Router()

router.get(
    '/',
    auth(USER_ROLE.admin),
    EnrolledCourseControllers.getAllEnrolledCourses,
)

router.post(
    '/create-enrolled-course',
    auth(USER_ROLE.student),
    validateRequest(
        EnrolledCourseValidations.createEnrolledCourseValidationSchema,
    ),
    EnrolledCourseControllers.createEnrolledCourse,
)

router.patch(
    '/update-enrolled-course-marks',
    auth(USER_ROLE.faculty),
    validateRequest(
        EnrolledCourseValidations.updateEnrolledCourseMarksValidationSchema,
    ),
    EnrolledCourseControllers.updateEnrolledCourseMarks,
)

export const EnrolledCourseRoutes = router
