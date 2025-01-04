import express from 'express'
import { AdminControllers } from './admin.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../User/user.const'

const router = express.Router()

router.get(
    '/',
    auth(USER_ROLE.superAdmin),
    AdminControllers.getAllAdmins,
)

router.get(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    AdminControllers.getSingleAdmin,
)

router.patch('/:id', auth(USER_ROLE.superAdmin), AdminControllers.updateAdmin)

router.delete('/:id', auth(USER_ROLE.superAdmin), AdminControllers.deleteAdmin)

export const AdminRoutes = router
