const { StatusCodes } = require("http-status-codes")
const { cloneDeep } = require("lodash")
const { slugify } = require("../utils/formatter")
const boardModel = require("../model/boardModel")
const ApiError = require("~/utils/ApiError")
module.exports = {
    createNew: async (reqBody) => {
        try {
            const newBoard = {
                ...reqBody,
                slug: slugify(reqBody.title)
            }
            // phải có return để trả về cho CONTROLLER
            const createdBoard = await boardModel.createNew(newBoard)
            const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
            return getNewBoard
        } catch (e) {
            throw new Error(e.message)
        }
    },
    getDetail: async (id) => {
        try {
            const board = await boardModel.getDetail(id)
            if (!board) {
                throw new ApiError(StatusCodes.NOT_FOUND, "Board not found")
            }
            const responseBoard = cloneDeep(board)
            responseBoard.columns.forEach(column => {
                column.cards = responseBoard.cards.filter(card => card?.columnId.toString() === column?._id.toString())
            })
            delete responseBoard.cards
            return responseBoard
        } catch (e) {
            throw new Error(e.message)
        }
    },
    update: async (id, reqBody) => {
        try {
            const updateData = {
                ...reqBody,
                updatedAt: Date.now()
            }
            const updateBoard = await boardModel.update(id, updateData)
            return updateBoard
        } catch (e) {
            throw new Error(e.message)
        }
    }
}