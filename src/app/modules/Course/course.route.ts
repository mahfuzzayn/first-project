import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { CourseValidations } from './course.validation'
import { CourseControllers } from './course.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.const'

const router = express.Router()

router.post(
    '/create-course',
    auth(USER_ROLE.admin),
    validateRequest(CourseValidations.createCourseValidationSchema),
    CourseControllers.createCourse,
)

router.get('/', CourseControllers.getAllCourses)

router.get(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    CourseControllers.getSingleCourse,
)

router.delete('/:id', CourseControllers.deleteCourse)

router.patch(
    '/:id',
    auth(USER_ROLE.admin),
    validateRequest(CourseValidations.updateCourseValidationSchema),
    CourseControllers.updateCourse,
)

router.put(
    '/:courseId/assign-faculties',
    auth(USER_ROLE.admin),
    validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
    CourseControllers.assignFacultiesWithCourse,
)

router.delete(
    '/:courseId/remove-faculties',
    auth(USER_ROLE.admin),
    validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
    CourseControllers.removeFacultiesFromCourse,
)

export const CourseRoutes = router