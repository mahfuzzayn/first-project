import { Model, Types } from 'mongoose'
import { TBloodGroup, TUserName } from '../../interface/user'

export type TAdmin = {
    id: string
    user: Types.ObjectId
    designation: string
    name: TUserName
    gender: 'male' | 'female'
    dateOfBirth: Date
    email: string
    contactNo: string
    emergencyContactNo: string
    bloodGroup: TBloodGroup
    presentAddress: string
    permanentAddress: string
    profileImg: string
    managementDepartment: Types.ObjectId
    isDeleted: boolean
}

export interface AdminModel extends Model<TAdmin> {
    isUserExists(id: string): Promise<TAdmin | null>
}
