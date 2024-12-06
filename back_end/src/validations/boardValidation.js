const { StatusCodes } = require("http-status-codes")
const Joi = require("joi")
const ApiError = require("../utils/ApiError")
const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
      title: Joi.string().required().min(3).max(50).trim().strict().messages({
        "any.required": "Title is required",
        "string.empty": "Title is not allowed to be empty",
        "string.min": "Tile min 3 chars",
        "string.max": "Title max 50 chars",
        "string.trim": "Title must not have leading or trailing spaces"
      }),
      description: Joi.string().required().min(3).max(256).trim().strict(),
      type: Joi.string().valid("public", "private").required()
    })
    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false } )
        // next cho đi tiếp nếu dữ liệu hợp lệ
        next()
    } catch (e) {
        next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(e).message)
        )
    }
}

const boardValidation = {
createNew
}
module.exports = { boardValidation }