import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AcademicDepartmentValidations } from './academicDepartment.validation'
import { AcademicDepartmentControllers } from './academicDepartment.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../User/user.const'

const router = express.Router()

router.post(
    '/create-academic-department',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
        AcademicDepartmentValidations.createAcademicDepartmentValidationSchema,
    ),
    AcademicDepartmentControllers.createAcademicDepartment,
)

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments)

router.get(
    '/:departmentId',
    AcademicDepartmentControllers.getSingleAcademicDepartment,
)

router.patch(
    '/:departmentId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
        AcademicDepartmentValidations.updateAcademicDepartmentValidationSchema,
    ),
    AcademicDepartmentControllers.updateAcademicDepartment,
)

export const AcademicDepartmentRoutes = router
