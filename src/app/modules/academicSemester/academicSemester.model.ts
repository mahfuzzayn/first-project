import { model, Schema } from 'mongoose'
import { TAcademicSemester } from './academicSemester.interface'
import {
    AcademicSemesterCode,
    AcademicSemesterName,
    Months,
} from './academicSemester.constant'

const academicSemesterSchema = new Schema<TAcademicSemester>(
    {
        name: {
            type: String,
            enum: AcademicSemesterName,
            required: true,
        },
        code: {
            type: String,
            enum: AcademicSemesterCode,
            required: true,
        },
        year: {
            type: String,
            required: true,
        },
        startMonth: {
            type: String,
            enum: Months,
            required: true,
        },
        endMonth: {
            type: String,
            enum: Months,
            required: true,
        },
    },
    {
        timestamps: true,
    },
)

academicSemesterSchema.pre('save', async function (next) {
    const isSemesterExists = await AcademicSemester.findOne({
        year: this.year,
        name: this.name,
    })

    if (isSemesterExists) {
        throw new Error('Semester already exists')
    }

    next()
})

export const AcademicSemester = model<TAcademicSemester>(
    'AcademicSemester',
    academicSemesterSchema,
)

// What to validate
// Name <-> Year
// Autumn => 2030
// Autumn => 2030 (Again)

// Code Requirement
// Autumn 01
// Summer 02
// Fall 03
