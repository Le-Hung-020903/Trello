const Joi = require("joi")
const { ObjectId } = require("mongodb")
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require("../utils/validators")
const { GET_DB } = require("~/config/mongodb")
const COLUMN_COLLECTION_NAME = "columns"
const COLUMN_COLLECTION_SCHEMA = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict(),
    cardOrderIds: Joi.array().items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
        ).default([]),
    createdAt: Joi.date().timestamp("javascript").default(Date.now),
    updatedAt: Joi.date().timestamp("javascript").default(null),
    _destroy: Joi.boolean().default(false)
})
const validateBeforeCreate = async (data) => {
    return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
export const createNewColumn = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const newValidData = {
            ...validData,
            boardId: new ObjectId(validData.boardId)
        }
        const createNewColumn = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(newValidData)
        return createNewColumn
    } catch (e) {
        throw new Error(e)
    }
}

export const findOneById = async (id) => {
    try {
        return await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
    } catch (e) {
        throw new Error(e)
    }
}

const pushCardOrderIds = async (card) => {
    try {
        const result = await GET_DB().collection(COLUMN_COLLECTION_NAME)
        .findOneAndUpdate({
                _id: new ObjectId(card.columnId)
            },
            {
                $push: {
                    cardOrderIds: new ObjectId(card._id)
                }
            },
            {
                returnDocument: "after"
            })
        return result.value
    } catch (e) {
        throw new Error(e)
    }
}

module.exports = {
    COLUMN_COLLECTION_NAME,
    COLUMN_COLLECTION_SCHEMA,
    findOneById,
    createNewColumn,
    pushCardOrderIds
}
