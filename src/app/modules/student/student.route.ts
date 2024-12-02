import express from 'express'
import { studentControllers } from './student.controller'

const router = express.Router()

router.get('/:studentId', studentControllers.getSingleStudent)

router.delete('/:studentId', studentControllers.deleteStudent)

router.put('/:studentId', studentControllers.updateStudent)

router.get('/', studentControllers.getAllStudents)

export const StudentRoutes = router
