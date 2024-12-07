var express = require("express")
var router = express.Router()
const { StatusCodes } = require("http-status-codes")
const boardRoute = require("./boardRouter")
const columnRoute = require("./columnRoute")
const cardRoute = require("./cardRoute")

// check api v1
router.get("/status", function (req, res) {
  res.status(StatusCodes.OK).json({ message: "APIs v1 are ready to use" })
})

//boards apis
router.use("/boards", boardRoute)

//columns apis
router.use("/columns", columnRoute)

//cards apis
router.use("/cards", cardRoute)

module.exports = router
