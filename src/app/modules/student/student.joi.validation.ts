import Joi from 'joi'

const userNameValidationSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .max(20)
    .required()
    .pattern(/^[A-Z][a-z]*$/, 'capitalized format')
    .messages({
      'string.base': 'First Name must be a string',
      'string.max': 'First Name cannot be more than 20 characters',
      'any.required': 'First Name is required',
      'string.pattern.name': '{#label} must be capitalized',
    }),
  middleName: Joi.string().trim().max(20).allow('').messages({
    'string.base': 'Middle Name must be a string',
    'string.max': 'Middle Name cannot be more than 20 characters',
  }),
  lastName: Joi.string()
    .trim()
    .required()
    .pattern(/^[a-zA-Z]+$/, 'alphabetic')
    .messages({
      'string.base': 'Last Name must be a string',
      'any.required': 'Last Name is required',
      'string.pattern.name':
        'Last Name must contain only alphabetic characters',
    }),
})

const guardianValidationSchema = Joi.object({
  fatherName: Joi.string().required().messages({
    'any.required': 'Father Name is required',
  }),
  fatherOccupation: Joi.string().required().messages({
    'any.required': 'Father Occupation is required',
  }),
  fatherContactNo: Joi.string().required().messages({
    'any.required': 'Father Contact No. is required',
  }),
  motherName: Joi.string().required().messages({
    'any.required': 'Mother Name is required',
  }),
  motherOccupation: Joi.string().required().messages({
    'any.required': 'Mother Occupation is required',
  }),
  motherContactNo: Joi.string().required().messages({
    'any.required': 'Mother Contact No. is required',
  }),
})

const localGuardianValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Local Guardian Name is required',
  }),
  occupation: Joi.string().required().messages({
    'any.required': 'Local Guardian Occupation is required',
  }),
  address: Joi.string().required().messages({
    'any.required': 'Local Guardian Address is required',
  }),
  contactNo: Joi.string().required().messages({
    'any.required': 'Local Guardian Contact No. is required',
  }),
})

const studentValidationSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'ID is required',
  }),
  name: userNameValidationSchema.required().messages({
    'any.required': 'User Schema is required',
  }),
  gender: Joi.string().valid('male', 'female', 'other').required().messages({
    'any.only': '{#label} must be one of [male, female, other]',
    'any.required': 'Gender is required',
  }),
  dateOfBirth: Joi.string().isoDate().optional().messages({
    'string.isoDate': 'Date of Birth must be a valid ISO date string',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': '{#label} must be a valid email',
  }),
  contactNo: Joi.string().required().messages({
    'any.required': 'Contact No. is required',
  }),
  emergencyContactNo: Joi.string().required().messages({
    'any.required': 'Emergency Contact No. is required',
  }),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .messages({
      'any.only': '{#label} must be a valid blood group',
    }),
  presentAddress: Joi.string().required().messages({
    'any.required': 'Present Address is required',
  }),
  permanentAddress: Joi.string().required().messages({
    'any.required': 'Permanent Address is required',
  }),
  guardian: guardianValidationSchema.required().messages({
    'any.required': 'Guardian Schema is required',
  }),
  localGuardian: localGuardianValidationSchema.required().messages({
    'any.required': 'Local Guardian Schema is required',
  }),
  profileImg: Joi.string().uri().optional().messages({
    'string.uri': 'Profile Image must be a valid URI',
  }),
  isActive: Joi.string().valid('active', 'blocked').default('active').messages({
    'any.only': '{#label} must be one of [active, blocked]',
  }),
})

export default studentValidationSchema
