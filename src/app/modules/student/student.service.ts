import { Student } from './student.model'
import { TStudent } from './student.interface'

const getAllStudentsFromDB = async () => {
  const result = await Student.find()
  return result
}

const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id })

  const result = await Student.aggregate([{ $match: { id: id } }])

  return result
}

const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne(
    { id },
    {
      isDeleted: true,
    },
  )
  return result
}

const updateStudentFromDB = async (
  id: string,
  updatedStudent: Partial<TStudent>,
) => {
  const result = await Student.updateOne(
    { id },
    {
      ...updatedStudent,
    },
  )

  return result
}

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentFromDB,
}
