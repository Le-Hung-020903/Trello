const { StatusCodes } = require("http-status-codes")
const Joi = require("joi")
const ApiError = require("../utils/ApiError")
const {
    OBJECT_ID_RULE,
    OBJECT_ID_RULE_MESSAGE
} = require("~/utils/validators")
const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        boardId: Joi.string()
            .required()
            .pattern(OBJECT_ID_RULE)
            .message(OBJECT_ID_RULE_MESSAGE),
        title: Joi.string().required().min(3).max(50).trim().strict()
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
const update = async (req, res, next) => {
    const correctCondition = Joi.object({
        title: Joi.string().min(3).max(50).trim().strict(),
        cardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    })
    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true } )
        // next cho đi tiếp nếu dữ liệu hợp lệ
        next()
    } catch (e) {
        next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(e).message)
        )
    }
}
const columnValidation = {
createNew,
update
}
module.exports = { columnValidation }