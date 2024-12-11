const { StatusCodes } = require("http-status-codes")
const { successResponse } = require("../utils/response")
const columnService = require("../services/columnsService")
module.exports = {
    createNewColumn: async (req, res, next) => {
        try {
            const createNewColumn = await columnService.createNewColumn(req.body)
            return successResponse(
                res,
                StatusCodes.CREATED,
                "Create new column successfully",
                createNewColumn
            )
        } catch (e) {
            next(e)
        }
    },
    update: async (req, res, next) => {
        try {
            const { id } = req.params
            const updatedColumn = await columnService.update(id, req.body)
            return successResponse(
                res,
                StatusCodes.OK,
                "Update column successfully",
                updatedColumn
            )
        } catch (e) {
            next(e)
        }
    },
    deleteColumn: async (req, res, next) => {
        try {
            const { id: columnId } = req.params
            const result = await columnService.deleteColumn(columnId)
            return successResponse(
                res,
                StatusCodes.OK,
                "Delete column successfully",
                result
            )
        } catch (e) {
            next(e)
        }
    }
}
