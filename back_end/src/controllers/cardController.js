const { StatusCodes } = require("http-status-codes")
const { successResponse } = require("~/utils/response")
const cardService = require("~/services/cardService")
module.exports = {
  createNewCard: async (req, res, next) => {
    try {
      const createNewCard = await cardService.createNewCard(req.body)
      return successResponse(
        res,
        StatusCodes.CREATED,
        "Create new card successfully",
        createNewCard
      )
    } catch (e) {
      next(e)
    }
  },
  update: async (req, res, next) => {
    try {
      const cardId = req.params.id
      const cardCoverFile = req.file
      const userInfo = req.jwtDecode
      const updateCard = await cardService.update(
        cardId,
        req.body,
        cardCoverFile,
        userInfo
      )
      return successResponse(
        res,
        StatusCodes.CREATED,
        "Update card successfully",
        updateCard
      )
    } catch (e) {
      next(e)
    }
  }
}
