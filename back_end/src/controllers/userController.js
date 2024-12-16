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
    },
    verify: async (req, res, next) => {
        try {
            const verifyUser = await userService.verify(req.body)
            return successResponse(
                res,
                StatusCodes.CREATED,
                "Verify successfully",
                verifyUser
            )
        } catch (e) {
            next(e)
        }
    },
    login: async (req, res, next) => {
        try {
            const result = await userService.login(req.body)
            // Trả về httpOnly cho trình duyệt
            return successResponse(
                res,
                StatusCodes.CREATED,
                "Login successfully",
                result
            )
        } catch (e) {
            next(e)
        }
    }

}