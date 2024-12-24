const { StatusCodes } = require("http-status-codes")
const { cloneDeep } = require("lodash")
const { slugify } = require("../utils/formatter")
const boardModel = require("../model/boardModel")
const columnModel = require("../model/columnModel")
const cardModel = require("../model/cardModel")
const ApiError = require("~/utils/ApiError")
const { DEFAULT_PAGE, DEFAULT_ITEMS_PAGE } = require("~/utils/constants")
module.exports = {
  createNew: async (userId, reqBody) => {
    try {
      const newBoard = {
        ...reqBody,
        slug: slugify(reqBody.title)
      }
      // phải có return để trả về cho CONTROLLER
      const createdBoard = await boardModel.createNew(userId, newBoard)
      const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
      return getNewBoard
    } catch (e) {
      throw new Error(e.message)
    }
  },
  getDetail: async (userId, boardId) => {
    try {
      const board = await boardModel.getDetail(userId, boardId)
      if (!board) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Board not found")
      }
      const responseBoard = cloneDeep(board)
      responseBoard.columns?.forEach((column) => {
        // column.cards = responseBoard.cards.filter(card => card?.columnId.toString() === column?._id.toString())
        column.cards = responseBoard.cards.filter((card) =>
          card.columnId.equals(column._id)
        )
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
  },
  moveCardToDifferentColumn: async (reqBody) => {
    try {
      // b1: xoá _id card ra khỏi column.cardOrderIds chứa nó
      await columnModel.update(reqBody.activeColumnId, {
        cardOrderIds: reqBody.preCardOrderIds,
        updatedAt: Date.now()
      })
      // b2: thêm _id card vào column mới.cardOrderIds chứa nó
      await columnModel.update(reqBody.activeColumnId, {
        cardOrderIds: reqBody.nextCardOrderIds,
        updatedAt: Date.now()
      })
      // b3: cập nhật lại trường columnId của card mới được kéo
      await cardModel.update(reqBody.currentCardId, {
        columnId: reqBody.overColumnId
        // updatedAt: Date.now()
      })
      return {
        updateResult: "Move card successfully"
      }
    } catch (e) {
      throw new Error(e.message)
    }
  },
  getBoards: async (userId, page, itemsPage, queryFilters) => {
    try {
      if (!page) page = DEFAULT_PAGE
      if (!itemsPage) itemsPage = DEFAULT_ITEMS_PAGE
      const result = await boardModel.getBoards(
        userId,
        parseInt(page, 10),
        parseInt(itemsPage, 10),
        queryFilters
      )
      return result
    } catch (e) {
      throw e
    }
  }
}
