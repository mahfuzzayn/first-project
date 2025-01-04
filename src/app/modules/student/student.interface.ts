import { Model, Types } from 'mongoose'
import { TBloodGroup, TUserName } from '../../interface/user'

export type TGuardian = {
    fatherName: string
    fatherOccupation: string
    fatherContactNo: string
    motherName: string
    motherOccupation: string
    motherContactNo: string
}

export type TLocalGuardian = {
    name: string
    occupation: string
    contactNo: string
    address: string
}

export type TStudent = {
    id: string
    user: Types.ObjectId
    name: TUserName
    gender: 'male' | 'female' | 'other'
    dateOfBirth: Date
    email: string
    avatar?: string
    contactNo: string
    emergencyContactNo: string
    bloodGroup?: TBloodGroup
    presentAddress: string
    permanentAddress: string
    guardian: TGuardian
    localGuardian: TLocalGuardian
    profileImg?: string
    admissionSemester: Types.ObjectId
    academicDepartment: Types.ObjectId
    academicFaculty: Types.ObjectId
    isDeleted: boolean
}

// For creating static

export interface StudentModel extends Model<TStudent> {
    isUserExists(id: string): Promise<TStudent | null>
}
