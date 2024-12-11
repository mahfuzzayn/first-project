import express from 'express'
import { AcademicFacultyControllers } from './academicFaculty.controller'
import validateRequest from '../../middlewares/validateRequest'
import { AcademicFacultyValidations } from './academicFaculty.validation'

const router = express.Router()

router.post(
    '/create-academic-faculty',
    validateRequest(
        AcademicFacultyValidations.createAcademicFacultyValidationSchema,
    ),
    AcademicFacultyControllers.createAcademicFaculty,
)

router.get('/', AcademicFacultyControllers.getAllAcademicFaculties)

router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicFaculty)

router.patch(
    '/:facultyId',
    validateRequest(
        AcademicFacultyValidations.updateAcademicFacultyValidationSchema,
    ),
    AcademicFacultyControllers.updateAcademicFaculty,
)

export const AcademicFacultyRoutes = router
