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
    }
}