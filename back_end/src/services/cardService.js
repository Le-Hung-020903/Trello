const cardModel = require("~/model/cardModel")
const columnModel = require("~/model/columnModel")
const { CloudianryProvider } = require("~/providers/CloudinaryProvider")
module.exports = {
  createNewCard: async (reqBody) => {
    try {
      const newBoard = {
        ...reqBody
      }
      // phải có return để trả về cho CONTROLLER
      const createdNewCard = await cardModel.createNewCard(newBoard)
      const getNewCard = await cardModel.findOneById(createdNewCard.insertedId)
      if (getNewCard) {
        await columnModel.pushCardOrderIds(getNewCard)
      }
      return getNewCard
    } catch (e) {
      throw new Error(e.message)
    }
  },
  update: async (cardId, reqBody, cardCoverFile, userInfo) => {
    try {
      const updateCard = {
        ...reqBody,
        updatedAt: Date.now()
      }
      let updatedCard = {}
      if (cardCoverFile) {
        // Upload file lên Cloud Storage (dịch vụ lưu trữ đám mây)
        const uploadImg = await CloudianryProvider.streamUpload(
          cardCoverFile.buffer,
          "card-covers"
        )
        // Lưu url của ảnh vào db
        updatedCard = await cardModel.update(cardId, {
          cover: uploadImg.secure_url
        })
      } else if (updateCard.commentToAdd) {
        // Tạo dữ liệu comment đưa vào db
        const commentData = {
          ...updateCard.commentToAdd,
          userEmail: userInfo.email,
          userId: userInfo._id,
          commentedAt: Date.now()
        }
        updatedCard = await cardModel.unShiftNewComment(cardId, commentData)
      } else if (updateCard.incomingMemberInfo) {
        // In case of adding or deleting member from the card
        updatedCard = await cardModel.updateMembers(
          cardId,
          updateCard.incomingMemberInfo
        )
      } else {
        // Các trường khác
        updatedCard = await cardModel.update(cardId, updateCard)
      }

      return updatedCard
    } catch (e) {
      throw new Error(e.message)
    }
  }
}
