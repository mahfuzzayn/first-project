import AppError from '../../errors/AppError'
import { AcademicDepartment } from '../AcademicDepartment/academicDepartment.model'
import { AcademicFaculty } from '../AcademicFaculty/academicFaculty.model'
import { Course } from '../Course/course.model'
import { Faculty } from '../Faculty/faculty.model'
import { SemesterRegistration } from '../SemesterRegistration/semesterRegistration.model'
import { TOfferedCourse } from './OfferedCourse.interface'
import { OfferedCourse } from './OfferedCourse.model'
import httpStatus from 'http-status'
import { hasTimeConflict } from './OfferedCourse.utils'
import QueryBuilder from '../../builder/QueryBuilder'
import { offeredCourseSearchableFields } from './OfferedCourse.const'
import { Student } from '../Student/student.model'

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const {
        semesterRegistration,
        academicFaculty,
        academicDepartment,
        course,
        section,
        faculty,
        days,
        startTime,
        endTime,
    } = payload

    // check if the semester registration id exists!
    const isSemesterRegistrationExists =
        await SemesterRegistration.findById(semesterRegistration)

    if (!isSemesterRegistrationExists) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Semester Registration not found',
        )
    }

    const academicSemester = isSemesterRegistrationExists.academicSemester

    const isAcademicFacultyExists =
        await AcademicFaculty.findById(academicFaculty)

    if (!isAcademicFacultyExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found')
    }

    const isAcademicDepartmentExists =
        await AcademicDepartment.findById(academicDepartment)

    if (!isAcademicDepartmentExists) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Academic Department not found',
        )
    }

    const isCourseExists = await Course.findById(course)

    if (!isCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
    }

    const isFacultyExists = await Faculty.findById(faculty)

    if (!isFacultyExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found')
    }

    // check if the department is belong to the faculty
    const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
        _id: academicDepartment,
        academicFaculty,
    })

    if (!isDepartmentBelongToFaculty) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `This ${isAcademicDepartmentExists.name} is not belong to this ${isAcademicFacultyExists.name}`,
        )
    }

    // check if the same course is in the same section in the same registered semester which exists
    const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
        await OfferedCourse.findOne({
            semesterRegistration,
            course,
            section,
        })

    if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Offered course with same section is already exists`,
        )
    }

    // get the schedules of the faculties
    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select('days startTime endTime')

    const newSchedule = { days, startTime, endTime }

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(
            httpStatus.CONFLICT,
            `This faculty is not available at that time! Choose other time or day`,
        )
    }

    const result = await OfferedCourse.create({
        ...payload,
        academicSemester,
    })

    return result
}

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
    const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
        .search(offeredCourseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await offeredCourseQuery.modelQuery
    const meta = await offeredCourseQuery.countTotal()

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered courses not found!')
    }

    return { meta, result }
}

const getMyOfferedCoursesFromDB = async (
    userId: string,
    query: Record<string, unknown>,
) => {
    const student = await Student.findOne({ id: userId })

    // Find the student
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found!')
    }

    // Current ongoing semester
    const currentOngoingRegistrationSemester =
        await SemesterRegistration.findOne({
            status: 'ONGOING',
        })

    if (!currentOngoingRegistrationSemester) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'There is no ongoing semester registration!',
        )
    }

    // Pagination setup

    const page = Number(query?.page) || 1
    const limit = Number(query?.limit) || 10
    const skip = (page - 1) * limit

    const aggregationQuery = [
        {
            $match: {
                semesterRegistration: currentOngoingRegistrationSemester?._id,
                academicFaculty: student.academicFaculty,
                academicDepartment: student.academicDepartment,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course',
            },
        },
        {
            $unwind: '$course',
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentOngoingRegistrationSemester:
                        currentOngoingRegistrationSemester?._id,
                    currentStudent: student?._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            '$semesterRegistration',
                                            '$$currentOngoingRegistrationSemester',
                                        ],
                                    },
                                    {
                                        $eq: ['$student', '$$currentStudent'],
                                    },
                                    {
                                        $eq: ['$isEnrolled', true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: 'enrolledCourses',
            },
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentStudent: student?._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$student', '$$currentStudent'],
                                    },
                                    {
                                        $eq: ['$isCompleted', true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: 'completedCourses',
            },
        },
        {
            $addFields: {
                completedCourseIds: {
                    $map: {
                        input: '$completedCourses',
                        as: 'completed',
                        in: '$$completed.course',
                    },
                },
            },
        },
        {
            $addFields: {
                isPreRequisitesFulfilled: {
                    $or: [
                        { $eq: ['$course.preRequisitesCourses', []] },
                        {
                            $setIsSubset: [
                                '$course.preRequisiteCourses.course',
                                '$completedCourseIds',
                            ],
                        },
                    ],
                },
                isAlreadyEnrolled: {
                    $in: [
                        '$course._id',
                        {
                            $map: {
                                input: '$enrolledCourses',
                                as: 'enroll',
                                in: '$$enroll.course',
                            },
                        },
                    ],
                },
            },
        },
        {
            $match: {
                isAlreadyEnrolled: false,
                isPreRequisitesFulfilled: true,
            },
        },
    ]

    const paginationQuery = [
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ]

    const result = await OfferedCourse.aggregate([
        ...aggregationQuery,
        ...paginationQuery,
    ])

    const total = (await OfferedCourse.aggregate(aggregationQuery)).length
    const totalPage = Math.ceil(result.length / limit)

    return {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
        result,
    }
}

const getSingleOfferedCoursesFromDB = async (id: string) => {
    const result = await OfferedCourse.findById(id)

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!')
    }

    return result
}

const updateOfferedCourseIntoDB = async (
    id: string,
    payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
    const { faculty, days, startTime, endTime } = payload

    const isOfferedCourseExists = await OfferedCourse.findById(id)

    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!')
    }

    const isFacultyExists = await Faculty.findById(faculty)

    if (!isFacultyExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!')
    }

    const semesterRegistration = isOfferedCourseExists.semesterRegistration

    const semesterRegistrationStatus =
        await SemesterRegistration.findById(semesterRegistration)

    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You cannot update this offered course as it is ${semesterRegistrationStatus?.status}`,
        )
    }

    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select('days startTime endTime')

    const newSchedule = { days, startTime, endTime }

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(
            httpStatus.CONFLICT,
            `This faculty is not available at that time! Choose other time or day`,
        )
    }

    const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
        new: true,
    })

    return result
}

const deleteOfferedCourseFromDB = async (id: string) => {
    const isOfferedCourseExists = await OfferedCourse.findById(id)

    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!')
    }

    const semesterRegistration = isOfferedCourseExists?.semesterRegistration

    const semesterRegistrationStatus =
        await SemesterRegistration.findById(semesterRegistration).select(
            'status',
        )

    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Offered course cannot be delete because the semester is ${semesterRegistrationStatus?.status}`,
        )
    }

    const result = await OfferedCourse.findByIdAndDelete(id)

    return result
}

export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    getAllOfferedCoursesFromDB,
    getMyOfferedCoursesFromDB,
    getSingleOfferedCoursesFromDB,
    updateOfferedCourseIntoDB,
    deleteOfferedCourseFromDB,
}
