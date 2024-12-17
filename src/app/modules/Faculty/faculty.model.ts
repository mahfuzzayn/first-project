import { model, Schema } from 'mongoose'
import { FacultyModel, TFaculty } from './faculty.interface'
import { TUserName } from '../../interface/user'
import validator from 'validator'

const userNameSchema = new Schema<TUserName>({
    firstName: {
        type: String,
        required: [true, 'First Name is required'],
        maxLength: [20, 'First Name cannot be more than 20 characters'],
        trim: true,
    },
    middleName: {
        type: String,
        maxLength: [20, 'Middle Name cannot be more than 20 characters'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is required'],
        maxLength: [20, 'Last Name cannot be more than 20 characters'],
        trim: true,
    },
})

const facultySchema = new Schema<TFaculty, FacultyModel>(
    {
        id: { type: String, required: [true, 'ID is required'], unique: true },
        user: {
            type: Schema.Types.ObjectId,
            required: [true, 'User ID is required'],
            unique: true,
            ref: 'User',
        },
        name: {
            type: userNameSchema,
            required: [true, 'Name is required'],
        },
        designation: {
            type: String,
            required: [true, 'Designation is required'],
        },
        gender: {
            type: String,
            enum: {
                values: ['male', 'female'],
                message: '{VALUE} is not valid gender',
            },
            required: [true, 'Gender is required'],
        },
        dateOfBirth: { type: Date },
        email: {
            type: String,
            required: [true, 'Email is required'],
            validate: {
                validator: (value: string) => validator.isEmail(value),
                message: '{VALUE} is not a valid email type',
            },
            unique: true,
        },
        contactNo: {
            type: String,
            required: [true, 'Contact No. is required'],
        },
        emergencyContactNo: {
            type: String,
            required: [true, 'Emergency Contact No. Name is required'],
        },
        bloodGroup: {
            type: String,
            enum: {
                values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
                message: '{VALUE} is not valid blood group',
            },
        },
        presentAddress: {
            type: String,
            required: [true, 'Present Address is required'],
        },
        permanentAddress: {
            type: String,
            required: [true, 'Permanent Address is required'],
        },
        profileImg: { type: String },
        academicDepartment: {
            type: Schema.Types.ObjectId,
            required: [true, 'Academic Department ID is required'],
            ref: 'AcademicDepartment',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
    },
)

facultySchema.virtual('fullName').get(function () {
    return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`
})

facultySchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } })
    next()
})

facultySchema.pre('findOne', function (next) {
    this.findOneAndUpdate({ isDeleted: { $ne: true } })
    next()
})

facultySchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
    next()
})

facultySchema.statics.isUserExists = async function (id: string) {
    const existingUser = await Faculty.findOne({ id })
    return existingUser
}

export const Faculty = model<TFaculty, FacultyModel>('Faculty', facultySchema)
