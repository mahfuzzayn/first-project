/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import { courseSearchableFields } from './course.const'
import { TCourse, TCourseFaculty } from './course.interface'
import { Course, CourseFaculty } from './course.model'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'

const createCourseIntoDB = async (payload: TCourse) => {
    const result = await Course.create(payload)

    return result
}

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(
        Course.find().populate('preRequisiteCourses.course'),
        query,
    )
        .search(courseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await courseQuery.modelQuery

    return result
}

const getSingleCourseFromDB = async (id: string) => {
    const result = await Course.findById(id).populate(
        'preRequisiteCourses.course',
    )

    return result
}

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(
        id,
        {
            isDeleted: true,
        },
        {
            new: true,
        },
    )

    return result
}

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourses, ...courseRemainingData } = payload

    // step-1: basic course info update

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
            id,
            courseRemainingData,
            {
                new: true,
                runValidators: true,
                session,
            },
        )

        if (!updateCourseIntoDB) {
            throw new AppError(httpStatus.OK, 'Failed to update course')
        }

        // step-2: check if any pre requisite courses  update

        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            // filter out the deleted fields
            const deletedPreRequisites = preRequisiteCourses
                .filter(el => el.course && el.isDeleted)
                .map(el => el.course)

            const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        preRequisiteCourses: {
                            course: { $in: deletedPreRequisites },
                        },
                    },
                },
                {
                    new: true,
                    runValidators: true,
                    session,
                },
            )

            if (!deletedPreRequisiteCourses) {
                throw new AppError(httpStatus.OK, 'Failed to update course')
            }

            // step-3 filter out the new course fields
            const newPreRequisites = preRequisiteCourses?.filter(
                el => el.course && !el.isDeleted,
            )

            const newPreRequisiteCourses = await Course.findByIdAndUpdate(
                id,
                {
                    $addToSet: {
                        preRequisiteCourses: {
                            $each: newPreRequisites,
                        },
                    },
                },
                {
                    new: true,
                    runValidators: true,
                    session,
                },
            )

            if (!newPreRequisiteCourses) {
                throw new AppError(httpStatus.OK, 'Failed to update course')
            }
        }

        const result = await Course.findById(id).populate(
            'preRequisiteCourses.course',
        )

        await session.commitTransaction()
        await session.endSession()

        return result
    } catch (error: any) {
        await session.abortTransaction()
        await session.endSession()

        throw new Error(error)
    }
}

const assignFacultiesWithCourseIntoDB = async (
    id: string,
    payload: Partial<TCourseFaculty>,
) => {
    const result = CourseFaculty.findByIdAndUpdate(
        id,
        {
            $addToSet: {
                course: id,
                faculties: { $each: payload },
            },
        },
        {
            upsert: true,
            new: true,
        },
    )

    return result
}

const removeFacultiesFromCourseIntoDB = async (
    id: string,
    payload: Partial<TCourseFaculty>,
) => {
    const result = CourseFaculty.findByIdAndUpdate(
        id,
        {
            $pull: {
                faculties: { $in: payload },
            },
        },
        {
            new: true,
        },
    )

    return result
}

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB,
    deleteCourseFromDB,
    updateCourseIntoDB,
    assignFacultiesWithCourseIntoDB,
    removeFacultiesFromCourseIntoDB,
}
