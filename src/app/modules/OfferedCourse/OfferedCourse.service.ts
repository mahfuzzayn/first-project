import AppError from '../../errors/AppError'
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model'
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model'
import { Course } from '../Course/course.model'
import { Faculty } from '../Faculty/faculty.model'
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model'
import { TOfferedCourse } from './OfferedCourse.interface'
import { OfferedCourse } from './OfferedCourse.model'
import httpStatus from 'http-status'
import { hasTimeConflict } from './OfferedCourse.utils'
import QueryBuilder from '../../builder/QueryBuilder'
import { offeredCourseSearchableFields } from './OfferedCourse.const'

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

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered courses not found!')
    }

    return result
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
    getSingleOfferedCoursesFromDB,
    updateOfferedCourseIntoDB,
    deleteOfferedCourseFromDB,
}
