var express = require("express")
var router = express.Router()
const columnController = require("../../controllers/columnController")
const { columnValidation } = require("../../validations/columnValidation")
const { authMiddleware } = require("../../middlewares/authMiddlewares")

router
    .route("/")
    .post(
        authMiddleware.isAuthorized,
        columnValidation.createNew,
        columnController.createNewColumn
    )
router.route("/:id").put(
    authMiddleware.isAuthorized,
    columnValidation.update,
    columnController.update
)
    .delete(
        authMiddleware.isAuthorized,
        columnValidation.deleteColumn,
        columnController.deleteColumn
)

module.exports = router
