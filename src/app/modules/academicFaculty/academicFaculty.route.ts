import express from 'express'
import { AcademicFacultyControllers } from './academicFaculty.controller'
import validateRequest from '../../middlewares/validateRequest'
import { AcademicFacultyValidations } from './academicFaculty.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../User/user.const'

const router = express.Router()

router.post(
    '/create-academic-faculty',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
        AcademicFacultyValidations.createAcademicFacultyValidationSchema,
    ),
    AcademicFacultyControllers.createAcademicFaculty,
)

router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    AcademicFacultyControllers.getAllAcademicFaculties,
)

router.get(
    '/:facultyId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    AcademicFacultyControllers.getSingleAcademicFaculty,
)

router.patch(
    '/:facultyId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
        AcademicFacultyValidations.updateAcademicFacultyValidationSchema,
    ),
    AcademicFacultyControllers.updateAcademicFaculty,
)

export const AcademicFacultyRoutes = router
