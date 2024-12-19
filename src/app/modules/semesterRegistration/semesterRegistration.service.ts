/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { AcademicSemester } from '../academicSemester/academicSemester.model'
import { RegistrationStatus } from './semesterRegistration.const'
import { TSemesterRegistration } from './semesterRegistration.interface'
import { SemesterRegistration } from './semesterRegistration.model'
import httpStatus from 'http-status'
import { OfferedCourse } from '../OfferedCourse/OfferedCourse.model'

const createSemesterRegistrationIntoDB = async (
    payload: TSemesterRegistration,
) => {
    const academicSemester = payload?.academicSemester

    // check if there any registered semester that is already "UPCOMING" | "ONGOING"
    const isThereAnyUpcomingOnGoingSemester =
        await SemesterRegistration.findOne({
            $or: [
                { status: RegistrationStatus.UPCOMING },
                { status: RegistrationStatus.ONGOING },
            ],
        })

    if (isThereAnyUpcomingOnGoingSemester) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            `There is already an ${isThereAnyUpcomingOnGoingSemester.status} registered semester`,
        )
    }

    // check if the semester exists already
    const isAcademicSemesterExists =
        await AcademicSemester.findById(academicSemester)

    if (!isAcademicSemesterExists) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'This academic semester does not exists',
        )
    }

    // check if the semester is already registered
    const isSemesterRegistrationExists = await SemesterRegistration.findOne({
        academicSemester,
    })

    if (isSemesterRegistrationExists) {
        throw new AppError(
            httpStatus.CONFLICT,
            'This semester is already registered',
        )
    }

    const result = await SemesterRegistration.create(payload)

    return result
}

const getAllSemesterRegistrationsFromDB = async (
    query: Record<string, unknown>,
) => {
    const semesterRegistrationQuery = new QueryBuilder(
        SemesterRegistration.find().populate('academicSemester'),
        query,
    )
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await semesterRegistrationQuery.modelQuery

    return result
}

const getSingleSemesterRegistrationFromDB = async (id: string) => {
    const result = await SemesterRegistration.findById(id)

    return result
}

const updateSemesterRegistrationIntoDB = async (
    id: string,
    payload: Partial<TSemesterRegistration>,
) => {
    // check if the semester registration exists
    const isSemesterRegistrationExists = await SemesterRegistration.findById(id)

    if (!isSemesterRegistrationExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'THis semester is not found!')
    }

    // check if the current semester registration is ended, we will not update anything
    const currentSemesterStatus = isSemesterRegistrationExists?.status
    const requestedStatus = payload?.status

    if (currentSemesterStatus === RegistrationStatus.ENDED) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `This semester is already ${currentSemesterStatus}`,
        )
    }

    // UPCOMING --> ONGOING --> ENDED
    if (
        currentSemesterStatus === RegistrationStatus.UPCOMING &&
        requestedStatus === RegistrationStatus.ENDED
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You cannot directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
        )
    }

    if (
        currentSemesterStatus === RegistrationStatus.ONGOING &&
        requestedStatus === RegistrationStatus.UPCOMING
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You cannot directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
        )
    }

    const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    })

    return result
}

const deleteSemesterRegistrationFromDB = async (id: string) => {
    const isSemesterRegistrationExists = await SemesterRegistration.findById(id)

    if (!isSemesterRegistrationExists) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Semester Registration not found!',
        )
    }

    const semesterRegistration = isSemesterRegistrationExists?._id

    const semesterRegistrationStatus = isSemesterRegistrationExists?.status

    if (semesterRegistrationStatus !== 'UPCOMING') {
        throw new AppError(
            httpStatus.NOT_FOUND,
            `Semester Registration cannot be deleted, because semester is ${semesterRegistrationStatus}`,
        )
    }

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        const deletedOfferedCourses = await OfferedCourse.deleteMany(
            {
                semesterRegistration,
            },
            {
                session,
            },
        )

        if (!deletedOfferedCourses) {
            throw new AppError(
                httpStatus.CONFLICT,
                'Failed to delete Offered courses!',
            )
        }

        const deletedSemesterRegistration =
            await SemesterRegistration.findByIdAndDelete(id, {
                session,
            })

        if (!deletedSemesterRegistration) {
            throw new AppError(
                httpStatus.CONFLICT,
                'Failed to delete Semester registration!',
            )
        }

        await session.commitTransaction()
        await session.endSession()

        return deletedSemesterRegistration
    } catch (error: any) {
        await session.abortTransaction()
        await session.endSession()

        throw new Error(error)
    }
}

export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationsFromDB,
    getSingleSemesterRegistrationFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationFromDB,
}
