import { model, Schema } from 'mongoose'
import { TSemesterRegistration } from './semesterRegistration.interface'
import { SemesterRegistrationStatus } from './semesterRegistration.const'

const semesterRegistrationSchema = new Schema<TSemesterRegistration>(
    {
        academicSemester: {
            type: Schema.Types.ObjectId,
            unique: true,
            ref: 'AcademicSemester',
        },
        status: {
            type: String,
            enum: SemesterRegistrationStatus,
            default: 'UPCOMING',
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        minCredit: {
            type: Number,
            required: true,
            default: 3,
        },
        maxCredit: {
            type: Number,
            required: true,
            default: 15,
        },
    },
    {
        timestamps: true,
    },
)

export const SemesterRegistration = model<TSemesterRegistration>(
    'SemesterRegistration',
    semesterRegistrationSchema,
)
