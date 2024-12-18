const { v4: uuidv4 } = require("uuid")
const bcryptjs = require("bcryptjs")
const ApiError = require("~/utils/ApiError")
const { StatusCodes } = require("http-status-codes")
const userModel = require("../model/userModel")
const { pickUser } = require("../utils/formatter")
const { BrevoProvider } = require("../providers/BrevoProvider")
const { WEBSITE_DOMAIN } = require("../utils/constants")
const { env } = require("../config/environment")
const { JwtProvider } = require("../providers/JwtProvider")
const { CloudianryProvider } = require("../providers/CloudinaryProvider")

module.exports = {
  register: async (reqBody) => {
    try {
      // - Kiểm tra xem email đã tồn tại trên hệ thống hay chưa
      const existUser = await userModel.findOneByEmail(reqBody.email)
      if (existUser) {
        throw new ApiError(StatusCodes.CONFLICT, "Email already exists")
      }
      // - Nếu chưa sẽ tạo tai khoan thì lưu info vào db
      const nameFromEmail = reqBody.email.split("@")[0]
      const newUser = {
        email: reqBody.email,
        password: bcryptjs.hashSync(reqBody.password, 8), // tham số thứ hai là độ phức tạp, càng lớn càng l
        username: nameFromEmail,
        displayName: nameFromEmail,
        verifyToken: uuidv4()
      }
      const createUser = await userModel.register(newUser)
      const getNewUser = await userModel.findOneById(createUser.insertedId)

      // - Gửi email xác thực người dùng
      const verifycationToken = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
      const customSubject =
        "Please verify your email before using our services!"
      const htmlContent = `
                <h3>Here is your verification link: </h3>
                <h3>${verifycationToken}</h3>
                <h3>Sincerely, <br /> - Le Dinh Hung - Full stack developer</h3>
            `
      // Goi tới Provider gửi email
      await BrevoProvider.sendEmail(
        getNewUser.email,
        customSubject,
        htmlContent
      )
      // - Trả về dữ liệu cho phía client
      return pickUser(getNewUser)
    } catch (e) {
      throw e
    }
  },
  verify: async (reqBody) => {
    try {
      const existUser = await userModel.findOneByEmail(reqBody.email)
      if (!existUser)
        throw new ApiError(StatusCodes.NOT_FOUND, "Account not found")
      if (existUser.isActive)
        throw new ApiError(
          StatusCodes.NOT_ACCEPTABLE,
          "Your account is already active"
        )
      if (reqBody.token !== existUser.verifyToken) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Token is invalid")
      }

      // Nếu như ok sẽ verify tài khoản
      const updateData = {
        isActive: true,
        verifyToken: null
      }
      const updatedUser = await userModel.updateById(existUser._id, updateData)
      return pickUser(updatedUser)
    } catch (e) {
      throw e
    }
  },
  login: async (reqBody) => {
    try {
      const { password, email } = reqBody
      const existUser = await userModel.findOneByEmail(email)
      if (!existUser)
        throw new ApiError(StatusCodes.NOT_FOUND, "Account not found")
      if (!existUser.isActive)
        throw new ApiError(
          StatusCodes.NOT_ACCEPTABLE,
          "Your account is not active"
        )
      if (!bcryptjs.compareSync(password, existUser.password)) {
        throw new ApiError(
          StatusCodes.NOT_ACCEPTABLE,
          "Your Email or Password is incorrect!"
        )
      }

      // Nếu tất cả ok sẽ bắt đầu tạo tokens đăng nhập để trả về cho phía FE
      // Thông tin sẽ đính kèm trong JWT bap gồm _id và email của user
      const userInfo = {
        _id: existUser._id,
        email: existUser.email
      }
      // Tạo ra 2 loại token: accessToken và refreshToken để trả về phía FE
      const accessToken = await JwtProvider.generateToken(
        userInfo,
        env.ACCESS_TOKEN_SECRET_SIGNATURE,
        // 5
        env.ACCESS_TOKEN_LIFE
      )
      const refreshToken = await JwtProvider.generateToken(
        userInfo,
        env.REFRESH_TOKEN_SECRET_SIGNATURE,
        // 15
        env.REFRESH_TOKEN_LIFE
      )
      // Trả về thông tin của user kèm theo 2 Token vừa tạo
      return {
        accessToken,
        refreshToken,
        ...pickUser(existUser)
      }
    } catch (e) {
      throw e
    }
  },
  refreshToken: async (clientRefreshToken) => {
    try {
      // Verify mã xem có hợp lệ không
      const refreshTokenDecode = await JwtProvider.verifyToken(
        clientRefreshToken,
        env.REFRESH_TOKEN_SECRET_SIGNATURE
      )

      // Đoạn này vì chúng ta chỉ lưu info unique và cố định của user
      // rồi, nên lấy ra từ decode để tiết kiệm DB lấy ra data mới
      const userInfo = {
        _id: refreshTokenDecode._id,
        email: refreshTokenDecode.email
      }

      // Tạo AccessToken mới
      const accessToken = await JwtProvider.generateToken(
        userInfo,
        env.ACCESS_TOKEN_SECRET_SIGNATURE,
        // 5
        env.ACCESS_TOKEN_LIFE
      )
      return { accessToken }
    } catch (e) {
      throw e
    }
  },
  update: async (userId, reqBody, userAvatarFile) => {
    try {
      const existUser = await userModel.findOneById(userId)
      if (!existUser)
        throw new ApiError(StatusCodes.NOT_FOUND, "Account not found")
      if (!existUser.isActive)
        throw new ApiError(
          StatusCodes.NOT_ACCEPTABLE,
          "Your account is not active"
        )
      let updateUser = {}

      // case change password
      if (reqBody.current_password && reqBody.new_password) {
        // kiểm tra xem current password có đúng hay không
        if (
          !bcryptjs.compareSync(reqBody.current_password, existUser.password)
        ) {
          throw new ApiError(
            StatusCodes.NOT_ACCEPTABLE,
            "Your current password is incorrect!"
          )
        }
        // Nếu đúng hash và updated
        updateUser = await userModel.updateById(existUser._id, {
          password: bcryptjs.hashSync(reqBody.new_password, 8)
        })
      } else if (userAvatarFile) {
        // Upload file lên Cloud Storage (dịch vụ lưu trữ đám mây)
        const uploadImg = await CloudianryProvider.streamUpload(
          userAvatarFile.buffer,
          "users"
        )
        // Lưu url của ảnh vào db
        updateUser = await userModel.updateById(existUser._id, {
          avatar: uploadImg.secure_url
        })
      } else {
        // Update các trường thông tin chung
        updateUser = await userModel.updateById(existUser._id, reqBody)
      }
      return pickUser(updateUser)
    } catch (e) {
      throw e
    }
  }
}
