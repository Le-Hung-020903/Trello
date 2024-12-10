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
            const updatedColumn = await columnService.update(id, req.Body)
            return successResponse(
                res,
                StatusCodes.OK,
                "Update column successfully",
                updatedColumn )
        } catch (e) {
            next(e)
        }
    }
}
