var express = require("express")
var router = express.Router()
const cardController = require("../../controllers/cardController")
const { cardValidation } = require("../../validations/cardValidation")
const { authMiddleware } = require("../../middlewares/authMiddlewares")
const {
  multerUploadMiddleware
} = require("../../middlewares/multerUploadMiddleware")

router
  .route("/")
  .post(
    authMiddleware.isAuthorized,
    cardValidation.createNew,
    cardController.createNewCard
  )

router
  .route("/:id")
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single("cardCover"),
    cardValidation.update,
    cardController.update
  )
module.exports = router
