const Joi = require("joi")
const { ObjectId } = require("mongodb")
const userModel = require("../model/userModel")
const boardModel = require("../model/boardModel")

const {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE
} = require("../utils/validators")
const {
  BOARD_INVITATION_STATUS,
  INVITATION_TYPES
} = require("../utils/constants")
const { GET_DB } = require("~/config/mongodb")

const INVITATION_COLLECTION_NAME = "inviations"
const INVITATION_COLLECTION_SCHEMA = Joi.object({
  inviterId: Joi.string() // Người đi mời
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  inviteeId: Joi.string() // Người được mời
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  type: Joi.string()
    .required()
    .valid(...Object.values(INVITATION_TYPES)),
  boardInvitation: Joi.object({
    boardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    status: Joi.string()
      .required()
      .valid(...Object.values(BOARD_INVITATION_STATUS))
  }).optional(),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = [
  "_id",
  "inviteeId",
  "inviterId",
  "type",
  "createdAt"
]
const validateBeforeCreate = async (data) => {
  return await INVITATION_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNewBoardInvitation = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    let newValidData = {
      ...validData,
      inviteeId: new ObjectId(validData.inviteeId),
      inviterId: new ObjectId(validData.inviterId)
    }
    // nếu tồn tại dữ liệu boardInvitation update cho cái boardId
    if (validData.boardInvitation) {
      newValidData.boardInvitation = {
        ...validData.boardInvitation,
        boardId: new ObjectId(validData.boardInvitation.boardId)
      }
    }

    const createdInvitation = await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .insertOne(newValidData)
    return createdInvitation
  } catch (e) {
    throw new Error(e)
  }
}

const findOneById = async (id) => {
  try {
    return await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id)
      })
  } catch (e) {
    throw new Error(e)
  }
}

const update = async (invitationId, updateData) => {
  try {
    Object.keys(updateData).forEach((item) => {
      if (INVALID_UPDATE_FIELDS.includes(item)) {
        delete updateData[item]
      }
    })
    // Đối với những dữ liệu quan trọng biến đổi ở đây
    if (updateData.boardInvitation) {
      updateData.boardInvitation = {
        ...updateData.boardInvitation,
        boardId: new ObjectId(updateData.boardInvitation.boardId)
      }
    }
    if (updateData.cardOrderIds) {
      updateData.cardOrderIds = updateData.cardOrderIds.map((item) => {
        return new ObjectId(item)
      })
    }
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(invitationId)
        },
        {
          $set: updateData
        },
        {
          returnDocument: "after"
        }
      )
    return result
  } catch (e) {
    throw new Error(e)
  }
}

// query tổng hợp (aggregate) để lấy booj những bản ghi invitation của 1 thẳng user cụ thể
const findByUser = async (userId) => {
  try {
    const queryConditions = [
      { inviterId: new ObjectId(userId) },
      { _destroy: false }
    ] // tìm theo inviteeId - người được mời (chính là người đang thực hiện request này)

    const results = await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            $and: queryConditions
          }
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: "inviterId", // Người đi mời
            foreignField: "_id",
            as: "inviter",
            // pipeline trong lookup là để xử lý một hoặc nhiều luồng cần thiết
            // $project để chỉ định vài field không muốn lấy về bằng cách gán = 0
            pipeline: [
              {
                $project: {
                  password: 0,
                  verifyToken: 0
                }
              }
            ]
          }
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: "inviteeId", // Người được mời
            foreignField: "_id",
            as: "invitee",
            pipeline: [
              {
                $project: {
                  password: 0,
                  verifyToken: 0
                }
              }
            ]
          }
        },
        {
          $lookup: {
            from: boardModel.BOARD_COLLECTION_NAME,
            localField: "boardInvitation.boardId", // Lấy ra thông tin của board
            foreignField: "_id",
            as: "board",
            pipeline: [
              {
                $project: {
                  password: 0,
                  verifyToken: 0
                }
              }
            ]
          }
        }
      ])
      .toArray()
    return results
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = {
  INVITATION_COLLECTION_SCHEMA,
  INVITATION_COLLECTION_NAME,
  createNewBoardInvitation,
  findOneById,
  update,
  findByUser
}
