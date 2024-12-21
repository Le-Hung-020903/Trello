const { StatusCodes } = require("http-status-codes")
const { successResponse } = require("../utils/response")
const invitationService = require("../services/innvitationService")
module.exports = {
  createNewBoardInvitation: async (req, res, next) => {
    try {
      const inviterId = req.jwtDecode._id
      const resInvitation = await invitationService.createNewBoardInvitation(
        req.body,
        inviterId
      )
      return successResponse(
        res,
        StatusCodes.CREATED,
        "Created invitation successfuly",
        resInvitation
      )
    } catch (e) {
      next(e)
    }
  },
  getInvitations: async (req, res, next) => {
    try {
      const userId = req.jwtDecode._id
      const getInvitations = await invitationService.getInvitations(userId)
      return successResponse(
        res,
        StatusCodes.CREATED,
        "Get invitation successfuly",
        getInvitations
      )
    } catch (e) {
      next(e)
    }
  },
  updateBoardInvitation: async (req, res, next) => {
    try {
      const userId = req.jwtDecode._id
      const { invitationId } = req.params
      const { status } = req.body
      const updateInvitation = await invitationService.updateBoardInvitation(
        userId,
        invitationId,
        status
      )
      return successResponse(
        res,
        StatusCodes.OK,
        "Update invitation successfuly",
        updateInvitation
      )
    } catch (e) {
      next(e)
    }
  }
}
