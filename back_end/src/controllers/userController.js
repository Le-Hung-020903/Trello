const { StatusCodes } = require("http-status-codes")
const { successResponse } = require("../utils/response")
const userService = require("../services/userService")
module.exports = {
    register: async (req, res, next) => {
        try {
            const registerUser = await userService.register(req.body)
            return successResponse(
                res,
                StatusCodes.CREATED,
                "Register successfully",
                registerUser
            )
        } catch (e) {
            next(e)
        }
    }

}