import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { SemesterRegistrationValidations } from './semesterRegistration.validation'
import { SemesterRegistrationControllers } from './semesterRegistration.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../User/user.const'

const router = express.Router()

router.post(
    '/create-semester-registration',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
        SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
    ),
    SemesterRegistrationControllers.createSemesterRegistration,
)

router.get(
    '/',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.faculty,
        USER_ROLE.student,
    ),
    SemesterRegistrationControllers.getAllSemesterRegistrations,
)

router.get(
    '/:id',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.faculty,
        USER_ROLE.student,
    ),
    SemesterRegistrationControllers.getSingleSemesterRegistration,
)

router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
        SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
    ),
    SemesterRegistrationControllers.updateSemesterRegistration,
)

router.delete(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    SemesterRegistrationControllers.deleteSemesterRegistration,
)

export const SemesterRegistrationRoutes = router
