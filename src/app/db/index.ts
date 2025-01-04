import config from '../config'
import { USER_ROLE } from '../modules/User/user.const'
import { TUser } from '../modules/User/user.interface'
import { User } from '../modules/User/user.model'

const superUser: Partial<TUser> = {
    id: '0001',
    email: 'mahfuzzayn8@gmail.com',
    password: config.super_admin_password,
    role: USER_ROLE.superAdmin,
    status: 'in-progress',
    isDeleted: false,
}

const seedSuperAdmin = async () => {
    // When database is connected, we will check is there any user who is super admin

    const isSuperAdminExists = await User.findOne({
        role: USER_ROLE.superAdmin,
    })

    if (!isSuperAdminExists) {
        await User.create(superUser)
    }
}

export default seedSuperAdmin
