import { model, Schema } from 'mongoose'
import { TUser, UserModel } from './user.interface'
import config from '../../config'
import bcrypt from 'bcrypt'

const userSchema = new Schema<TUser, UserModel>(
    {
        id: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
            select: 0,
        },
        needsPasswordChange: {
            type: Boolean,
            default: true,
        },
        passwordChangedAt: {
            type: Date,
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

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
    return await User.findOne({ id }).select('+password')
}

userSchema.statics.isPasswordMatched = async function (
    plainTextPassword: string,
    bcryptPassword: string,
) {
    return await bcrypt.compare(plainTextPassword, bcryptPassword)
}

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
    passwordChangeTimestamp: Date,
    jwtIssuedTimestamp: number,
) {
    const passwordChangedTime =
        new Date(passwordChangeTimestamp).getTime() / 1000

    return passwordChangedTime > jwtIssuedTimestamp
}

export const User = model<TUser, UserModel>('User', userSchema)
