const multer = require("multer")
const {
  LIMIT_COMMON_FILE_SIZE,
  ALLOW_COMMON_FILE_TYPES
} = require("../utils/validators")
const ApiError = require("../utils/ApiError")
const { StatusCodes } = require("http-status-codes")

// Hàm kiểm tra loại file nào được chấp nhận
const customFileFilter = (req, file, cb) => {
  console.log("Multer file: ", file)

  //- Đối với multer sẽ dùng mimetype để chek kiểu
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errorMessage =
      "Invalid file type. Only accept PNG, JPG, and JPEG. hung"
    return cb(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage),
      null
    )
  }

  //- Nếu như file hợp lệ
  // Tham số đầu là null là không có lỗi
  // Tham số 2 là hợp lệ (thành công)
  return cb(null, true)
}

// Khởi tạo function upload được bọc bởi multer
const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customFileFilter
})
export const multerUploadMiddleware = { upload }
