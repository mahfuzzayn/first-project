import { z } from 'zod'
import { UserStatus } from './user.const'

const userValidationSchema = z.object({
    password: z
        .string({
            invalid_type_error: 'Password must be string',
        })
        .max(20, { message: 'Password cannot be more than 20 characters' }),
})

const changeStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum([...UserStatus] as [string, ...string[]], {
            required_error: 'Status is required',
        }),
    }),
})

export const UserValidations = {
    userValidationSchema,
    changeStatusValidationSchema,
}
