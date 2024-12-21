const { pickUser } = require("../utils/formatter")
const boardModel = require("~/model/boardModel")
const userModel = require("~/model/userModel")
const innvitationModel = require("~/model/innvitationModel")
const ApiError = require("~/utils/ApiError")
const { StatusCodes } = require("http-status-codes")
const {
  INVITATION_TYPES,
  BOARD_INVITATION_STATUS
} = require("~/utils/constants")
module.exports = {
  createNewBoardInvitation: async (reqBody, inviterId) => {
    try {
      // Người đi mời chính là req
      const inviter = await userModel.findOneById(inviterId)
      console.log("🚀 ~ createNewBoardInvitation: ~ inviter:", inviter)
      // người được mời là lấy từ FE
      const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail)
      console.log("🚀 ~ createNewBoardInvitation: ~ invitee:", invitee)
      // Lấy board được mời vào
      const board = await boardModel.findOneById(reqBody.boardId)
      console.log("🚀 ~ createNewBoardInvitation: ~ board:", board)
      // không tồn tại 1 trong 3 bỏ qua
      if (!invitee || !board || !inviter) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Inviter, Invitee or board not found!"
        )
      }
      const newInvitationData = {
        inviterId,
        inviteeId: invitee._id.toString(),
        type: INVITATION_TYPES.BOARD_INVIATION,
        boardInvitation: {
          boardId: board._id.toString(),
          status: BOARD_INVITATION_STATUS.PENDING // trạng thái ban đầu
        }
      }

      const createdInvitation = await innvitationModel.createNewBoardInvitation(
        newInvitationData
      )
      const getInvitation = await innvitationModel.findOneById(
        createdInvitation.insertedId
      )
      const resInvitation = {
        ...getInvitation,
        board,
        inviter: pickUser(inviter),
        invitee: pickUser(invitee)
      }
      return resInvitation
      // Trừ info board invitation mới tạo thì trả về thoải mái
    } catch (e) {
      throw e
    }
  },
  getInvitations: async (userId) => {
    try {
      const getInvitations = await innvitationModel.findByUser(userId)
      return getInvitations
    } catch (e) {
      throw e
    }
  },
  updateBoardInvitation: async (userId, invitationId, status) => {
    try {
      //- Tìm bản ghi invitation trong model
      const getInvitation = await innvitationModel.findOneById(invitationId)
      if (!getInvitation)
        throw new ApiError(StatusCodes.NOT_FOUND, "Invitation not found!")

      //- Sau khi có Invitation rồi thì lấy full info của board
      const boardId = getInvitation.boardInvitation.boardId
      const getBoard = await boardModel.findOneById(boardId)
      if (!getBoard)
        throw new ApiError(StatusCodes.NOT_FOUND, "Board not found!")

      //- Kiểm tra xem nếu status là ACCRpTED join board mà cái thằng user (invitee) đã
      // là owner hoặc member của board rồi thì trả về thông báo lỗi luôn
      //- Note: 2 mảng memberIds và ownerIds của board nó đang là kiểu ObjectID nên cho nó hết về String để check
      const boardOwnerAndMembers = [...getBoard.ownerIds, ...getBoard.memberIds]
      if (
        status === BOARD_INVITATION_STATUS.ACCEPTED &&
        boardOwnerAndMembers.includes(userId)
      ) {
        throw new ApiError(
          StatusCodes.NOT_ACCEPTABLE,
          "You are already a member of this board!"
        )
      }
      const updateData = {
        boardInvitation: {
          ...getInvitation.boardInvitation,
          status
        }
      }
      // Tạo dữ liệu để update bản ghi Invitation
    } catch (e) {
      throw e
    }
  }
}
