import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { OfferedCourseValidations } from './OfferedCourse.validation'
import { OfferedCourseControllers } from './OfferedCourse.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../User/user.const'

const router = express.Router()

router.post(
    '/create-offered-course',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
        OfferedCourseValidations.createOfferedCourseValidationSchema,
    ),
    OfferedCourseControllers.createOfferedCourse,
)

router.get(
    '/my-offered-courses',
    auth(USER_ROLE.student),
    OfferedCourseControllers.getMyOfferedCourses,
)

router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    OfferedCourseControllers.getAllOfferedCourses,
)


router.get(
    '/:id',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.faculty,
        USER_ROLE.student,
    ),
    OfferedCourseControllers.getSingleOfferedCourse,
)

router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
        OfferedCourseValidations.updateOfferedCourseValidationSchema,
    ),
    OfferedCourseControllers.updateOfferedCourse,
)

router.delete(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    OfferedCourseControllers.deleteOfferedCourse,
)

export const OfferedCourseRoutes = router
