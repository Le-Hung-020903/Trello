const cardModel = require("~/model/cardModel")
const columnModel = require("~/model/columnModel")
module.exports = {
    createNewCard: async (reqBody) => {
        try {
            const newBoard = {
                ...reqBody
            }
            // phải có return để trả về cho CONTROLLER
            const createdNewCard = await cardModel.createNewCard(newBoard)
            const getNewCard = await cardModel.findOneById(
                createdNewCard.insertedId
            )
            if (getNewCard) {
                await columnModel.pushCardOrderIds(getNewCard)
            }
            return getNewCard
        } catch (e) {
            throw new Error(e.message)
        }
    }
}