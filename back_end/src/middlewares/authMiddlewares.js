const { StatusCodes } = require("http-status-codes")
const { JwtProvider } = require("../providers/JwtProvider")
const { env } = require("../config/environment")
const ApiError = require("../utils/ApiError")

// Middleware này sẽ đảm nhận vai trò xác thực JWT access token gửi lên từ FE có hợp lệ hay không
const isAuthorized = async (req, res, next) => {
  // Lấy accessToken nằm trong request cookies phía client - withCredentials
  // trong file authorizeAxios
  const clientAccessToken = req.cookies?.accessToken

  //Nếu như clientAccessTOken không tồn tại trả về lỗi
  if (!clientAccessToken) {
    next(
      new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized! (token not found")
    )
    return
  }

  try {
    // b1: decode token xem có hợp lệ hay không
    const accessTokenDecode = await JwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )
    // b2: Nếu hợp lệ thì cần phải lưu thông tin giải mã vào req để các tầng khác có thể dùng
    req.jwtDecode = accessTokenDecode

    // b3: cho req đi tiếp
    next()
  } catch (e) {
    // Nếu cái accessToken nó bị hết hạn (expires) thì cần phỉa trả về một mã lỗi cho
    // phía FE biết để gọi api refresh (410)
    if (e?.message?.includes("jwt expired")) {
      next(new ApiError(StatusCodes.GONE, "Need to refresh token."))
      return
    }

    // Nếu như cái accessToken nó không hợp lệ do bất kỳ điều gì khác, thì chúng ta
    // thẳng tay trả về 401 cho phía FE gọi api sign_out luôn
    next(new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized!"))
  }
}
export const authMiddleware = {
  isAuthorized
}
