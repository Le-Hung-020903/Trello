const { v4: uuidv4 } = require('uuid')
const bcryptjs = require('bcryptjs')
const ApiError = require("~/utils/ApiError")
const { StatusCodes } = require("http-status-codes")
const userModel = require("../model/userModel")
const { pickUser } = require("../utils/formatter")
module.exports = {
    register: async (reqBody) => {
        try {
            // - Kiểm tra xem email đã tồn tại trên hệ thống hay chưa
            const existUser = await userModel.findOneByEmail(reqBody.email)
            if (existUser) {
                throw new ApiError(StatusCodes.CONFLICT, 'Email already exists')
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

            // - Trả về dữ liệu cho phía client
            return pickUser(getNewUser)
        } catch (e) {
            throw e
        }
    }
}