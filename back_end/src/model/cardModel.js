const Joi = require("joi")
const { ObjectId } = require("mongodb")
const { GET_DB } = require("~/config/mongodb")
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require("../utils/validators")
const CARD_COLLECTION_NAME = "cards"
const CARD_COLLECTION_SCHEMA = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().optional(),

    createdAt: Joi.date().timestamp("javascript").default(Date.now),
    updatedAt: Joi.date().timestamp("javascript").default(null),
    _destroy: Joi.boolean().default(false)
})
const validateBeforeCreate = async (data) => {
    return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNewCard = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        return await GET_DB()
          .collection(CARD_COLLECTION_NAME)
          .insertOne({
            ...validData,
            boardId: new ObjectId(validData.boardId),
            columnId: new ObjectId(validData.columnId)
          })
    } catch (e) {
        throw new Error(e)
    }
}

const findOneById = async (id) => {
    try {
        return await GET_DB().collection(CARD_COLLECTION_NAME).findOne({
        _id: new ObjectId(id)
        })
    } catch (e) {
        throw new Error(e)
    }
}


module.exports = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNewCard,
  findOneById
}
