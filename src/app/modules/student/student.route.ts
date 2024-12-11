import express from 'express'
import { studentControllers } from './student.controller'
import validateRequest from '../../middlewares/validateRequest'
import { updateStudentValidationSchema } from './student.validation'

const router = express.Router()

router.get('/:studentId', studentControllers.getSingleStudent)

router.delete('/:studentId', studentControllers.deleteStudent)

router.patch(
    '/:studentId',
    validateRequest(updateStudentValidationSchema),
    studentControllers.updateStudent,
)

router.get('/', studentControllers.getAllStudents)

export const StudentRoutes = router
