var express = require("express")
var router = express.Router()
const userController = require("~/controllers/userController")
const { userValidation } = require("~/validations/uservalidation")

router.route("/register").post(userValidation.register, userController.register)

router.route("/verify").put(userValidation.verify, userController.verify)

router.route("/login").post(userValidation.login, userController.login)

module.exports = router
