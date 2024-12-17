var express = require("express")
var router = express.Router()
const { StatusCodes } = require("http-status-codes")
const { boardValidation } = require("../../validations/boardValidation")
const boardController = require("../../controllers/boardController")
const { authMiddleware } = require("../../middlewares/authMiddlewares")

router
  .route("/")
  .get(authMiddleware.isAuthorized, (req, res) => {
    res.status(StatusCodes.OK).json({ message: "APi get list board" })
  })
  .post(
    authMiddleware.isAuthorized,
    boardValidation.createNew,
    boardController.createNew
  )

router
  .route("/:id")
  .get(authMiddleware.isAuthorized, boardController.getDetail)
  .put(
    authMiddleware.isAuthorized,
    boardValidation.update,
    boardController.update
  )

router
  .route("/supports/moving_card")
  .put(
    authMiddleware.isAuthorized,
    boardValidation.moveCardToDifferentColumn,
    boardController.moveCardToDifferentColumn
  )
module.exports = router