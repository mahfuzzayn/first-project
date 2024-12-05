import { model, Schema } from 'mongoose'
import { TUser } from './user.interface'
import config from '../../config'
import bcrypt from 'bcrypt'

const userSchema = new Schema<TUser>(
    {
        id: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
        },
        needsPasswordChange: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            enum: ['student', 'faculty', 'admin'],
        },
        status: {
            type: String,
            enum: ['in-progress', 'blocked'],
            default: 'in-progress',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
)

// Document Middleware
// pre save middleware/ hook : will work on create(), save()
userSchema.pre('save', async function (next) {
    // console.log(this, 'pre hook: we will save the data')
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this

    // hashing password and saving into DB
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds),
    )
    next()
})

// set '' after saving password
// post save middleware/ hook : will work on create(), save()
userSchema.post('save', function (doc, next) {
    doc.password = ''
    next()
})

export const User = model<TUser>('User', userSchema)
