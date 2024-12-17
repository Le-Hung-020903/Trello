var express = require("express")
var router = express.Router()
const cardController = require("../../controllers/cardController")
const { cardValidation } = require("../../validations/cardValidation")
const { authMiddleware } = require("../../middlewares/authMiddlewares")

router
    .route("/")
    .post(authMiddleware.isAuthorized, cardValidation.createNew, cardController.createNewCard)
module.exports = router
