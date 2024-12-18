var express = require("express")
var router = express.Router()
const userController = require("~/controllers/userController")
const { userValidation } = require("~/validations/uservalidation")
const { authMiddleware } = require("../../middlewares/authMiddlewares")
const {
  multerUploadMiddleware
} = require("../../middlewares/multerUploadMiddleware")

router.route("/register").post(userValidation.register, userController.register)

router.route("/verify").put(userValidation.verify, userController.verify)

router.route("/login").post(userValidation.login, userController.login)

router.route("/logout").delete(userController.logout)

router.route("/refresh-token").get(userController.refreshToken)

router
  .route("/update")
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single("avatar"),
    userValidation.update,
    userController.update
  )

module.exports = router
