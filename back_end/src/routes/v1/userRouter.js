var express = require("express")
var router = express.Router()
const userController = require("~/controllers/userController")
const { userValidation } = require("~/validations/uservalidation")

router.route("/register").post(userValidation.register, userController.register)

module.exports = router
