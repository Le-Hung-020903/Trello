const { StatusCodes } = require("http-status-codes")
const { successResponse } = require("~/utils/response")
const boardService = require("~/services/boardService")
module.exports = {
  createNew: async (req, res, next) => {
    try {
      // điều hướng dữ liệu sang tầng SERVICE
      const createBoard = await boardService.createNew(req.body)
      // Có kết quả ở SERVICE thì trả về phía client
      return successResponse(
        res,
        StatusCodes.CREATED,
        "Create new board successfully",
        createBoard
      )
    } catch (e) {
      next(e)
    }
  },
  getDetail: async (req, res, next) => {
      try {
        const { id } = req.params
        const board = await boardService.getDetail(id)
        return successResponse(
          res,
          StatusCodes.OK,
          "Get board detail successfully",
          board
        )
      } catch (e) {
        next(e)
      }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params
      const updatedBoard = await boardService.update(id, req.body)
        return successResponse(
        res,
        StatusCodes.OK,
        "Update board detail successfully",
        updatedBoard
      )
    } catch (e) {
      next(e)
    }
  },
  moveCardToDifferentColumn: async (req, res, next) => {
    try {
      const result = await boardService.moveCardToDifferentColumn(req.body)
      return successResponse(
        res,
        StatusCodes.OK,
        "",
        result
      )
    } catch (e) {
      next(e)
    }
  }

}