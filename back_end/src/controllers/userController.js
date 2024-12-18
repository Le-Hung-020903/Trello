const { StatusCodes } = require("http-status-codes")
const { successResponse } = require("../utils/response")
const userService = require("../services/userService")
const ms = require("ms")
const ApiError = require("~/utils/ApiError")
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
      // đối với maxAge thì chúng ta sẽ để tối đa là 14 ngày, tuỳ dự án.
      // Lưu ý thời gian sống của cookie != với time life của token

      // Trả về httpOnly cho trình duyệt
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: true,
        sampleSize: "none",
        maxAge: ms("14 days")
      })
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sampleSize: "none",
        maxAge: ms("14 days")
      })
      return successResponse(
        res,
        StatusCodes.CREATED,
        "Login successfully",
        result
      )
    } catch (e) {
      next(e)
    }
  },
  logout: async (req, res, next) => {
    try {
      // Xoá cookie - đơn giản là làm ngược lại so với gán ở hàm login
      res.clearCookie("accessToken")
      res.clearCookie("refreshToken")
      return successResponse(res, StatusCodes.OK, "Logout successfully", {
        loggedOut: true
      })
    } catch (e) {
      next(e)
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const result = await userService.refreshToken(req.cookies?.refreshToken)
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: true,
        sampleSize: "none",
        maxAge: ms("14 days")
      })
      return successResponse(
        res,
        StatusCodes.CREATED,
        "Verify successfully",
        result
      )
    } catch (e) {
      next(
        new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Please Sign In! (Error from refresh token)"
        )
      )
    }
  },
  update: async (req, res, next) => {
    try {
      const userId = req.jwtDecode._id
      const userAvatarFile = req.file
      const updatedUser = await userService.update(
        userId,
        req.body,
        userAvatarFile
      )
      return successResponse(
        res,
        StatusCodes.OK,
        "Update user successfully",
        updatedUser
      )
    } catch (e) {
      next(e)
    }
  }
}
