var express = require("express")
var router = express.Router()
const { StatusCodes } = require("http-status-codes")
const boardRoute = require("./boardRouter")

// check api v1
router.get("/status", function (req, res) {
  res.status(StatusCodes.OK).json({ message: "APIs v1 are ready to use" })
})

//boards apis
router.use("/boards", boardRoute)

module.exports = router
