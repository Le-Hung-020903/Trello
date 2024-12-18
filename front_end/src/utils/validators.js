export const FIELD_REQUIRE_MESSAGE = "This field is required"
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE =
  "Email is invalid. (example:lehung020903@gmail.com)"
export const PASSWORD_RULE = /^(?=.[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE =
  "Password must include at least 1 letter, a number, and at least 8 characters"

export const LIMIT_COMMON_FILE_SIZE = 10485760 // byte = 10MB
export const ALLOW_COMMON_FILE_TYPES = ["image/png", "image/jpg", "image/jpeg"]
export const singleFileValidator = (file) => {
  if (!file || !file.name || !file.size || !file.type) {
    return "File cannot be blank."
  }
  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return "Maximun file size exceeded. (10MB"
  }
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return "Invalid file type. Only accept PNG, JPG, and JPEG."
  }
  return null
}
