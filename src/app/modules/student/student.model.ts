import { Schema, model } from 'mongoose'
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentModel,
  TUserName,
} from './student.interface'
import validator from 'validator'
import bcrypt from 'bcrypt'
import config from '../../config'

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    maxLength: [20, 'First Name cannot be more than 20 characters'],
    trim: true,
    validate: {
      validator: function (value: string) {
        const firstNameStr =
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        return firstNameStr === value
      },
      message: '{VALUE} is not in capitalized format',
    },
  },
  middleName: {
    type: String,
    maxLength: [20, 'Middle Name cannot be more than 20 characters'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required'],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not valid',
    },
  },
})

const guardianSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: [true, 'Father Name is required'] },
  fatherOccupation: {
    type: String,
    required: [true, 'Father Occupation is required'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father Contact No. is required'],
  },
  motherName: { type: String, required: [true, 'Mother Name is required'] },
  motherOccupation: {
    type: String,
    required: [true, 'Mother Occupation is required'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother Contact No. is required'],
  },
})

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: [true, 'Local Guardian Name is required'] },
  occupation: {
    type: String,
    required: [true, 'Local Guardian Occupation is required'],
  },
  address: {
    type: String,
    required: [true, 'Local Guardian Address is required'],
  },
  contactNo: {
    type: String,
    required: [true, 'Local Guardian Contact No. is required'],
  },
})

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: [true, 'Password is required'],
      maxLength: [20, 'Password cannot be more than 20 characters'],
    },
    name: {
      type: userNameSchema,
      required: [true, 'User Schema is required'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not valid gender',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: [true, 'Email is required'],
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: '{VALUE} is not a valid email type',
      },
      unique: true,
    },
    contactNo: { type: String, required: [true, 'Contact No. is required'] },
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
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian Schema is required'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local Guardian Schema is required'],
    },
    profileImg: { type: String },
    isActive: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
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

studentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`
})

// Document Middleware
// pre save middleware/ hook : will work on create(), save()
studentSchema.pre('save', async function (next) {
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

// post save middleware/ hook : will work on create(), save()
studentSchema.post('save', function (doc, next) {
  doc.password = ''
  next()
})

// Query Middleware

studentSchema.pre('find', function (next) {
  this.find({
    isDeleted: { $ne: true },
  })

  next()
})

studentSchema.pre('findOne', function (next) {
  this.find({
    isDeleted: { $ne: true },
  })
  next()
})

// Aggregate Middleware

// [ { $match: { isDeleted: { $ne: true } } } ], { '$match': { id: '12345' } } ]

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { isDeleted: { $ne: true } },
  })
  next()
})

// Creating a custom static method

studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id })
  return existingUser
}

// Creating a custom instance method
// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({ id })
//   return existingUser
// }

export const Student = model<TStudent, StudentModel>('Student', studentSchema)
