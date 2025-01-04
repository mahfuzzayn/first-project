import express from 'express'
import { FacultyControllers } from './faculty.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../User/user.const'

const router = express.Router()

router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    FacultyControllers.getAllFaculties,
)

router.get(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    FacultyControllers.getSingleFaculty,
)

router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    FacultyControllers.updateFaculty,
)

router.delete(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    FacultyControllers.deleteFaculty,
)

export const FacultyRoutes = router
