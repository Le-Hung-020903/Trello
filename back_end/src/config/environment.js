require("dotenv").config()
const env = {
  MONGODB_URL: process.env.MONGODB_URL,
  DATABASE_NAME: process.env.DATABASE_NAME,
  BUILD_MODE: process.env.BUILD_MODE,
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT
}
module.exports = {
  env
}
