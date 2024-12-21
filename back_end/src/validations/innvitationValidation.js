const { StatusCodes } = require("http-status-codes")
const Joi = require("joi")
const ApiError = require("../utils/ApiError")

const constcreateNewBoardInvitation = async (req, res, next) => {
  const correctCondition = Joi.object({
    inviteeEmail: Joi.string().required(),
    boardId: Joi.string().required()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (e) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(e).message))
  }
}
const invitationValidation = {
  constcreateNewBoardInvitation
}
module.exports = invitationValidation
