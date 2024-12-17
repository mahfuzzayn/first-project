import { Model, Types } from 'mongoose'
import { TBloodGroup, TUserName } from '../../interface/user'

export type TFaculty = {
    id: string
    user: Types.ObjectId
    designation: string
    name: TUserName
    gender: 'male' | 'female'
    dateOfBirth?: Date
    email: string
    contactNo: string
    emergencyContactNo: string
    bloodGroup?: TBloodGroup
    presentAddress: string
    permanentAddress: string
    profileImg: string
    academicDepartment: Types.ObjectId
    isDeleted: boolean
}

export interface FacultyModel extends Model<TFaculty> {
    isUserExists: (id: string) => Promise<TFaculty | null>
}
