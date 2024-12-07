var express = require("express")
var router = express.Router()
const cardController = require("../../controllers/cardController")
const { cardValidation } = require("../../validations/cardValidation")
router.route("/").post(cardValidation.createNew, cardController.createNewCard)
module.exports = router
