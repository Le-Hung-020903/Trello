const { StatusCodes } = require("http-status-codes")
const { successResponse } = require("~/utils/response")
const boardService = require("~/services/boardService")
module.exports = {
  createNew: async (req, res, next) => {
    try {
      // điều hướng dữ liệu sang tầng SERVICE
      const userId = req.jwtDecode._id
      const createBoard = await boardService.createNew(userId, req.body)
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
  getBoards: async (req, res, next) => {
    try {
      const userId = req.jwtDecode._id
      const { page, itemsPage } = req.query
      const results = await boardService.getBoards(userId, page, itemsPage)
      return successResponse(
        res,
        StatusCodes.OK,
        "Get board detail successfully",
        results
      )
    } catch (e) {
      next(e)
    }
  },
  getDetail: async (req, res, next) => {
    try {
      const userId = req.jwtDecode._id
      const boardId = req.params.id
      const board = await boardService.getDetail(userId, boardId)
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
      return successResponse(res, StatusCodes.OK, "", result)
    } catch (e) {
      next(e)
    }
  }
}
