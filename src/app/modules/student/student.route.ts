import express from 'express'
import { StudentControllers } from './student.controller'
import validateRequest from '../../middlewares/validateRequest'
import { updateStudentValidationSchema } from './student.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../User/user.const'

const router = express.Router()

router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.faculty, USER_ROLE.admin),
    StudentControllers.getAllStudents,
)

router.get(
    '/:studentId',
    auth(USER_ROLE.superAdmin, USER_ROLE.faculty, USER_ROLE.admin),
    StudentControllers.getSingleStudent,
)

router.delete(
    '/:studentId',
    auth(USER_ROLE.superAdmin, USER_ROLE.faculty, USER_ROLE.admin),
    StudentControllers.deleteStudent,
)

router.patch(
    '/:studentId',
    auth(USER_ROLE.superAdmin, USER_ROLE.faculty, USER_ROLE.admin),
    validateRequest(updateStudentValidationSchema),
    StudentControllers.updateStudent,
)

export const StudentRoutes = router
