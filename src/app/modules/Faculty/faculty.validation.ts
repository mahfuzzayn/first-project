import { z } from 'zod'

// Define UserName schema
const createUserNameValidationSchema = z.object({
    firstName: z
        .string()
        .min(1, 'First Name is required')
        .max(20, 'First Name cannot exceed 20 characters')
        .refine(
            value => /^[A-Z][a-z]*$/.test(value),
            'First Name must start with a capital letter and be alphabetic',
        ),
    middleName: z
        .string()
        .max(20, 'Middle Name cannot exceed 20 characters')
        .optional(),
    lastName: z
        .string()
        .min(1, 'Last Name is required')
        .refine(
            value => /^[a-zA-Z]+$/.test(value),
            'Last Name must contain only alphabetic characters',
        ),
})

// Define Faculty schema
export const createFacultyValidationSchema = z.object({
    body: z.object({
        password: z.string().max(20, 'Password is required'),
        faculty: z.object({
            name: createUserNameValidationSchema,
            designation: z.string().min(3, 'Designation is required'),
            gender: z.enum(['male', 'female', 'other'], {
                errorMap: () => ({
                    message:
                        'Gender must be one of "male", "female", or "other"',
                }),
            }),
            dateOfBirth: z.string().optional(),
            email: z.string().email('Invalid email address'),
            avatar: z.string().url('Invalid avatar URL').optional(),
            contactNo: z.string().min(1, 'Contact No. is required'),
            emergencyContactNo: z
                .string()
                .min(1, 'Emergency Contact No. is required'),
            bloodGroup: z
                .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
                    errorMap: () => ({ message: 'Invalid blood group' }),
                })
                .optional(),
            presentAddress: z.string().min(1, 'Present Address is required'),
            permanentAddress: z
                .string()
                .min(1, 'Permanent Address is required'),
            profileImg: z.string().url('Invalid profile image URL').optional(),
            academicDepartment: z.string(),
        }),
    }),
})

// Define Update User Schema
const updateUserNameValidationSchema = z.object({
    firstName: z
        .string()
        .max(20, 'First Name cannot exceed 20 characters')
        .refine(
            value => /^[A-Z][a-z]*$/.test(value),
            'First Name must start with a capital letter and be alphabetic',
        )
        .optional(),
    middleName: z
        .string()
        .max(20, 'Middle Name cannot exceed 20 characters')
        .optional(),
    lastName: z
        .string()
        .max(20, 'Last Name cannot exceed 20 characters')
        .refine(
            value => /^[a-zA-Z]+$/.test(value),
            'Last Name must contain only alphabetic characters',
        )
        .optional(),
})

// Define Update Faculty schema
export const updateFacultyValidationSchema = z.object({
    body: z.object({
        faculty: z.object({
            name: updateUserNameValidationSchema.optional(),
            designation: z
                .string()
                .min(3, 'Designation is required')
                .optional(),
            gender: z
                .enum(['male', 'female', 'other'], {
                    errorMap: () => ({
                        message:
                            'Gender must be one of "male", "female", or "other"',
                    }),
                })
                .optional(),
            dateOfBirth: z.string().optional(),
            email: z.string().email('Invalid email address').optional(),
            avatar: z.string().url('Invalid avatar URL').optional().optional(),
            contactNo: z.string().optional(),
            emergencyContactNo: z.string().optional(),
            bloodGroup: z
                .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
                    errorMap: () => ({ message: 'Invalid blood group' }),
                })
                .optional(),
            presentAddress: z.string().optional(),
            permanentAddress: z.string().optional(),
            profileImg: z.string().url('Invalid profile image URL').optional(),
            academicDepartment: z.string().optional(),
        }),
    }),
})

export const FacultyValidations = {
    createFacultyValidationSchema,
    updateFacultyValidationSchema,
}
