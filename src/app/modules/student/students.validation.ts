import { z } from 'zod'

// Define UserName schema
const userNameValidationSchema = z.object({
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

// Define Guardian schema
const guardianValidationSchema = z.object({
  fatherName: z.string().min(1, 'Father Name is required'),
  fatherOccupation: z.string().min(1, 'Father Occupation is required'),
  fatherContactNo: z.string().min(1, 'Father Contact No. is required'),
  motherName: z.string().min(1, 'Mother Name is required'),
  motherOccupation: z.string().min(1, 'Mother Occupation is required'),
  motherContactNo: z.string().min(1, 'Mother Contact No. is required'),
})

// Define LocalGuardian schema
const localGuardianValidationSchema = z.object({
  name: z.string().min(1, 'Local Guardian Name is required'),
  occupation: z.string().min(1, 'Local Guardian Occupation is required'),
  contactNo: z.string().min(1, 'Local Guardian Contact No. is required'),
  address: z.string().min(1, 'Local Guardian Address is required'),
})

// Define Student schema
const studentValidationSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  password: z.string().max(20, 'Password is required'),
  name: userNameValidationSchema,
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({
      message: 'Gender must be one of "male", "female", or "other"',
    }),
  }),
  dateOfBirth: z.string().min(1, 'Date of Birth is required'),
  email: z.string().email('Invalid email address'),
  avatar: z.string().url('Invalid avatar URL').optional(),
  contactNo: z.string().min(1, 'Contact No. is required'),
  emergencyContactNo: z.string().min(1, 'Emergency Contact No. is required'),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
      errorMap: () => ({ message: 'Invalid blood group' }),
    })
    .optional(),
  presentAddress: z.string().min(1, 'Present Address is required'),
  permanentAddress: z.string().min(1, 'Permanent Address is required'),
  guardian: guardianValidationSchema,
  localGuardian: localGuardianValidationSchema,
  profileImg: z.string().url('Invalid profile image URL').optional(),
  isActive: z.enum(['active', 'blocked'], {
    errorMap: () => ({ message: 'Status must be "active" or "blocked"' }),
  }),
  isDeleted: z.boolean(),
})

export default studentValidationSchema
