import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AdminServices } from './admin.service'
import httpStatus from 'http-status'

const getSingleAdmin = catchAsync(async (req, res) => {
    const { id } = req.params

    const result = await AdminServices.getSingleAdminFromDB(id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin retrieved successfully',
        data: result,
    })
})

const getAllAdmins = catchAsync(async (req, res) => {
    const result = await AdminServices.getAllAdminsFromDB(req.query)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admins retrieved successfully',
        data: result,
    })
})

const deleteAdmin = catchAsync(async (req, res) => {
    const { id } = req.params

    const result = await AdminServices.deleteAdminFromDB(id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin deleted successfully',
        data: result,
    })
})

const updateAdmin = catchAsync(async (req, res) => {
    const { id } = req.params
    const { admin: updatedData } = req.body

    const result = await AdminServices.updateAdminIntoDB(id, updatedData)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin updated successfully',
        data: result,
    })
})

export const AdminControllers = {
    getSingleAdmin,
    getAllAdmins,
    updateAdmin,
    deleteAdmin,
}
