import express, { NextFunction, Request, Response } from 'express'
import { UserControllers } from './user.controller'
import { StudentValidations } from '../student/student.validation'
import validateRequest from '../../middlewares/validateRequest'
import { FacultyValidations } from '../Faculty/faculty.validation'
import { AdminValidations } from '../Admin/admin.validate'
import auth from '../../middlewares/auth'
import { USER_ROLE } from './user.const'
import { UserValidations } from './user.validation'
import { upload } from '../../utils/sendImageToCloudinary'

const router = express.Router()

router.post(
    '/create-student',
    auth(USER_ROLE.admin),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(StudentValidations.createStudentValidationSchema),
    UserControllers.createStudent,
)

router.post(
    '/create-faculty',
    auth(USER_ROLE.admin),

    validateRequest(FacultyValidations.createFacultyValidationSchema),
    UserControllers.createFaculty,
)

router.post(
    '/create-admin',
    auth(USER_ROLE.admin),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(AdminValidations.createAdminValidationSchema),
    UserControllers.createAdmin,
)

router.post(
    '/change-status/:id',
    auth(USER_ROLE.admin),
    validateRequest(UserValidations.changeStatusValidationSchema),
    UserControllers.changeStatus,
)

router.get(
    '/me',
    auth(USER_ROLE.student, USER_ROLE.faculty, USER_ROLE.admin),
    UserControllers.getMe,
)

export const UserRoutes = router
