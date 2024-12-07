const Joi = require("joi")
const { ObjectId, ReturnDocument } = require("mongodb")
const {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE
} = require("~/utils/validators")
const columnModel = require("./columnModel")
const cardModel = require("./cardModel")
const { GET_DB } = require("../config/mongodb")
const BOARD_COLLECTION_NAME = "boards"
const BOARD_COLLECTION_SCHEMA = Joi.object({
    slug: Joi.string().required().min(3).trim().strict(),
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    columnOrderIds: Joi.array().items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      ).default([]),
    type: Joi.string().valid('public', 'private').required(),
    createdAt: Joi.date().timestamp("javascript").default(Date.now),
    updatedAt: Joi.date().timestamp("javascript").default(null),
    _destroy: Joi.boolean().default(false)
})
const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    return await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .insertOne(validData)
  } catch (e) {
    throw new Error(e)
  }
}

const findOneById = async (id) => {
  try {
    return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
  } catch (e) {
    throw new Error(e)
  }
}

// query tổng hợp
const getDetail = async (id) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            _destroy: false
          }
        },
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: "_id",
            foreignField: "boardId",
            as: "columns"
          }
        },
        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: "_id",
            foreignField: "boardId",
            as: "cards"
          }
        }
      ])
      .toArray()
    return result[0] || {}
  } catch (e) {
    throw new Error(e)
  }
}

export const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(column.boardId)
        },
        {
          $push: {
            columnOrderIds: new ObjectId(column._id)
          }
        },
        {
          returnDocument: "after"
        }
      )
      return result.value
  } catch (e) {
    throw new Error(e)
  }
}
module.exports = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetail,
  pushColumnOrderIds
}