/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '../../errors/AppError'
import { OfferedCourse } from '../OfferedCourse/OfferedCourse.model'
import { TEnrolledCourse } from './enrolledCourse.interface'
import httpStatus from 'http-status'
import { EnrolledCourse } from './enrolledCourse.model'
import { Student } from '../Student/student.model'
import mongoose from 'mongoose'
import { SemesterRegistration } from '../SemesterRegistration/semesterRegistration.model'
import { Course } from '../Course/course.model'
import { Faculty } from '../Faculty/faculty.model'
import { calculateGradeAndPoints } from './enrolledCourse.utils'
import QueryBuilder from '../../builder/QueryBuilder'
import { enrolledCourseSearchableFields } from './enrolledCourse.const'

const createEnrolledCourseIntoDB = async (
    userId: string,
    payload: Partial<TEnrolledCourse>,
) => {
    /*
        Step-1: Check if the offered courses is exists
        Step-2: Check if the student is already enrolled
        Step-3: Check if the max credits exceeds
        Step-4: Create an Enrolled Course
    */

    const { offeredCourse } = payload

    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)

    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!')
    }

    if (isOfferedCourseExists.maxCapacity <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Room is full!')
    }

    const student = await Student.findOne(
        {
            id: userId,
        },
        { _id: 1 },
    )

    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found!')
    }

    const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        offeredCourse,
        student: student?._id,
    })

    if (isStudentAlreadyEnrolled) {
        throw new AppError(httpStatus.CONFLICT, 'Student is already enrolled!')
    }

    // Check total credits exceeds maxCredit
    const course = await Course.findById(isOfferedCourseExists?.course)

    const currentCredit = course?.credits

    const semesterRegistration = await SemesterRegistration.findById(
        isOfferedCourseExists?.semesterRegistration,
        { maxCredit: 1 },
    )

    const maxCredit = semesterRegistration?.maxCredit

    const enrolledCourses = await EnrolledCourse.aggregate([
        {
            $match: {
                semesterRegistration:
                    isOfferedCourseExists?.semesterRegistration,
                student: student?._id,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'enrolledCoursesData',
            },
        },
        {
            $unwind: '$enrolledCoursesData',
        },
        {
            $group: {
                _id: null,
                totalEnrolledCredits: { $sum: '$enrolledCoursesData.credits' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEnrolledCredits: 1,
            },
        },
    ])

    // total enrolled credits + new enrolled course credit > maxCredit
    const totalCredits =
        enrolledCourses.length > 0
            ? enrolledCourses[0]?.totalEnrolledCredits
            : 0

    if (totalCredits && maxCredit && totalCredits + currentCredit > maxCredit) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'You have exceeded maximum number of credits!',
        )
    }

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        const result = await EnrolledCourse.create(
            [
                {
                    semesterRegistration:
                        isOfferedCourseExists?.semesterRegistration,
                    academicSemester: isOfferedCourseExists?.academicSemester,
                    academicFaculty: isOfferedCourseExists?.academicFaculty,
                    academicDepartment:
                        isOfferedCourseExists?.academicDepartment,
                    offeredCourse: offeredCourse,
                    course: isOfferedCourseExists?.course,
                    student: student?._id,
                    faculty: isOfferedCourseExists?.faculty,
                    isEnrolled: true,
                },
            ],
            { session },
        )

        if (!result) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to enroll in this course!',
            )
        }

        const maxCapacity = isOfferedCourseExists?.maxCapacity

        await OfferedCourse.findByIdAndUpdate(
            offeredCourse,
            {
                maxCapacity: maxCapacity - 1,
            },
            {
                session,
            },
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

const getAllEnrolledCoursesFromDB = async (query: Record<string, unknown>) => {
    const enrolledCoursesQuery = new QueryBuilder(EnrolledCourse.find(), query)
        .search(enrolledCourseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await enrolledCoursesQuery.modelQuery
    const meta = await enrolledCoursesQuery.countTotal()

    return { meta, result }
}

const getSingleEnrolledCourseFromDB = async (enrolledCourseId: string) => {
    const result = await EnrolledCourse.findById(enrolledCourseId)

    return result
}

const getMyEnrolledCoursesFromDB = async (
    studentId: string,
    query: Record<string, unknown>,
) => {
    const student = await Student.findOne({
        id: studentId,
    })

    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found!')
    }

    const enrolledCoursesQuery = new QueryBuilder(
        EnrolledCourse.find({ student: student._id }).populate(
            'semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty',
        ),
        query,
    )
        .search(enrolledCourseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await enrolledCoursesQuery.modelQuery
    const meta = await enrolledCoursesQuery.countTotal()

    return { meta, result }
}

const updateEnrolledCourseMarksIntoDB = async (
    facultyId: string,
    payload: Partial<TEnrolledCourse>,
) => {
    const { semesterRegistration, offeredCourse, student, courseMarks } =
        payload

    const isSemesterRegistrationExists =
        await SemesterRegistration.findById(semesterRegistration)

    if (!isSemesterRegistrationExists) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Semester registration not found!',
        )
    }

    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)

    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!')
    }

    const isStudentExists = await Student.findById(student)

    if (!isStudentExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found!')
    }

    const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 })

    if (!faculty) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!')
    }

    const isEnrolledCourseBelongToFaculty = await EnrolledCourse.findOne({
        semesterRegistration,
        offeredCourse,
        student,
        faculty: faculty?._id,
    })

    if (!isEnrolledCourseBelongToFaculty) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!')
    }

    // console.log(isEnrolledCourseBelongToFaculty)

    const modifiedData: Record<string, unknown> = {
        ...courseMarks,
    }

    if (courseMarks?.finalTerm.toString()) {
        const { classTest1, classTest2, midTerm, finalTerm } =
            isEnrolledCourseBelongToFaculty.courseMarks
        const totalMarks =
            Math.ceil(classTest1) +
            Math.ceil(midTerm) +
            Math.ceil(classTest2) +
            Math.ceil(finalTerm)

        const result = calculateGradeAndPoints(totalMarks)

        modifiedData.grade = result.grade
        modifiedData.gradePoints = result.gradePoints
        modifiedData.isCompleted = true
    }

    if (courseMarks && Object.keys(courseMarks).length) {
        for (const [key, value] of Object.entries(courseMarks)) {
            modifiedData[`courseMarks.${key}`] = value
        }
    }

    const result = await EnrolledCourse.findByIdAndUpdate(
        isEnrolledCourseBelongToFaculty?._id,
        modifiedData,
        {
            new: true,
        },
    )

    return result
}

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB,
    getAllEnrolledCoursesFromDB,
    getSingleEnrolledCourseFromDB,
    getMyEnrolledCoursesFromDB,
    updateEnrolledCourseMarksIntoDB,
}
