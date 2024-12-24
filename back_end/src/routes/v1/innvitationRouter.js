var express = require("express")
var router = express.Router()
const innvitationController = require("../../controllers/innvitationController")
const invitationValidation = require("../../validations/innvitationValidation")
const { authMiddleware } = require("../../middlewares/authMiddlewares")

router
  .route("/board")
  .post(
    authMiddleware.isAuthorized,
    invitationValidation.constcreateNewBoardInvitation,
    innvitationController.createNewBoardInvitation
  )
router
  .route("/")
  .get(authMiddleware.isAuthorized, innvitationController.getInvitations)

router
  .route("/board/:invitationId")
  .put(authMiddleware.isAuthorized, innvitationController.updateBoardInvitation)
module.exports = router
