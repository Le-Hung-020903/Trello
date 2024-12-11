var express = require("express")
var router = express.Router()
const { StatusCodes } = require("http-status-codes")
const { boardValidation } = require("../../validations/boardValidation")
const boardController = require("../../controllers/boardController")

router
  .route("/")
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: "APi get list board" })
  })
  .post(boardValidation.createNew, boardController.createNew)

router
  .route("/:id")
  .get(boardController.getDetail)
  .put(boardValidation.update, boardController.update)

router
  .route("/supports/moving_card")
  .put(
    boardValidation.moveCardToDifferentColumn,
    boardController.moveCardToDifferentColumn
  )
module.exports = router