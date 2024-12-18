const cloudinary = require("cloudinary").v2
const streamifier = require("streamifier")
const { env } = require("../config/environment")

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
})

// Khởi tạo một function để thực hiện upload file lên cloudinary
const streamUpload = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    // Tạo luồn stream để upload lên cloudinary
    let stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (err, result) => {
        if (err) reject(err)
        else resolve(result)
      }
    )

    // Thực hiện upload cái luồng trên bằng lib streamifier
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}
export const CloudianryProvider = { streamUpload }
