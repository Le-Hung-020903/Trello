var express = require("express")
var router = express.Router()
const columnController = require("../../controllers/columnController")
const { columnValidation } = require("../../validations/columnValidation")
router.route("/").post(columnValidation.createNew, columnController.createNewColumn)
router.route("/:id").put(columnValidation.update, columnController.update).delete(columnValidation.deleteColumn, columnController.deleteColumn)

module.exports = router
