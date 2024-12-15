const { StatusCodes } = require("http-status-codes")
const Joi = require("joi")
const ApiError = require("../utils/ApiError")
const {
    EMAIL_RULE,
    EMAIL_RULE_MESSAGE,
    PASSWORD_RULE,
    PASSWORD_RULE_MESSAGE
} = require("~/utils/validators")

const register = async (req, res, next) => {
    const correctCondition = Joi.object({
        email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
        password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE)
    })
    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false } )
        next()
    } catch (e) {
        next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(e).message)
        )
    }
}
const userValidation = {
    register
}
module.exports = { userValidation }