import { model, Schema } from 'mongoose'
import {
    TCourse,
    TCourseFaculty,
    TPreRequisiteCourses,
} from './course.interface'

const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>({
    course: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Courses',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
})

const courseSchema = new Schema<TCourse>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        unique: true,
        trim: true,
    },
    prefix: {
        type: String,
        required: [true, 'Prefix is required'],
        trim: true,
    },
    code: {
        type: Number,
        required: [true, 'Code is required'],
        trim: true,
    },
    credits: {
        type: Number,
        required: [true, 'Credits is required'],
        trim: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    preRequisiteCourses: [preRequisiteCoursesSchema],
})

const courseFacultySchema = new Schema<TCourseFaculty>({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        unique: true,
    },
    faculties: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Faculty',
        },
    ],
})

export const CourseFaculty = model<TCourseFaculty>(
    'CourseFaculty',
    courseFacultySchema,
)

export const Course = model<TCourse>('Courses', courseSchema)
