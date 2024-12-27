import express from 'express'
import { StudentControllers } from './student.controller'
import validateRequest from '../../middlewares/validateRequest'
import { updateStudentValidationSchema } from './student.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.const'

const router = express.Router()

router.get('/', StudentControllers.getAllStudents)

router.get(
    '/:studentId',
    auth(USER_ROLE.faculty, USER_ROLE.admin),
    StudentControllers.getSingleStudent,
)

router.delete('/:studentId', StudentControllers.deleteStudent)

router.patch(
    '/:studentId',
    validateRequest(updateStudentValidationSchema),
    StudentControllers.updateStudent,
)

export const StudentRoutes = router
