const JWT = require("jsonwebtoken")

// Tạo mới token cần 3 tham số: userInfo thông tin user
// secretSignature chữ ký bí mật, tokenLife thời gian sống
const generateToken = async (userInfo, secretSignature, tokenLife) => {
    try {
        return JWT.sign(userInfo, secretSignature, {
            algorithm: "HS256",
            // thời gian hết hạn
            expiresIn: tokenLife
        })
    } catch (e) {
        throw new Error(e)
    }
}

// Kiểm tra token có hợp lệ không
// là cái token được tạo ra có đúng với cái chữ ký bí mật secretSignature trong dự án không?
const verifyToken = async (token, secretSignature) => {
    try {
        // Kiểm tra xem hai tham số có đúng không
        return JWT.verify(token, secretSignature)
    } catch (e) {
        throw new Error(e)
    }
}
export const JwtProvider = {
    generateToken,
    verifyToken
}