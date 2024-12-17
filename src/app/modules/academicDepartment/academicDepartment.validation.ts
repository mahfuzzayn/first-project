import { z } from 'zod'

const createAcademicDepartmentValidationSchema = z.object({
    body: z.object({
        name: z.string({
            invalid_type_error: 'Name must be string',
            required_error: 'Name is required',
        }),

        academicFaculty: z.string({
            invalid_type_error: 'Academic department must be string',
            required_error: 'Academic department is required',
        }),
    }),
})

const updateAcademicDepartmentValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                invalid_type_error: 'Name must be string',
            })
            .optional(),
        academicFaculty: z
            .string({
                invalid_type_error: 'Academic department must be string',
            })
            .optional(),
    }),
})

export const AcademicDepartmentValidations = {
    createAcademicDepartmentValidationSchema,
    updateAcademicDepartmentValidationSchema,
}
