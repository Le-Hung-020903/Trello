const Joi = require("joi")
const { ObjectId } = require("mongodb")
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require("~/utils/validators")
const columnModel = require("./columnModel")
const cardModel = require("./cardModel")
const userModel = require("./userModel")
const { GET_DB } = require("../config/mongodb")
const { pagingSkipValue } = require("../utils/algorithms")
const BOARD_COLLECTION_NAME = "boards"
const BOARD_COLLECTION_SCHEMA = Joi.object({
  slug: Joi.string().required().min(3).trim().strict(),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  // Những Admin của board
  ownerIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  // Những member của board
  memberIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  type: Joi.string().valid("public", "private").required(),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false)
})

// chỉ định ra những trường mà không muốn cho phép cập nhật lại
const INVALID_UPDATE_FIELDS = ["_id", "createdAt"]
const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNew = async (userId, data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newBoardToAdd = {
      ...validData,
      ownerIds: [new ObjectId(userId)]
    }
    return await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .insertOne(newBoardToAdd)
  } catch (e) {
    throw new Error(e)
  }
}

const findOneById = async (id) => {
  try {
    return await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id)
      })
  } catch (e) {
    throw new Error(e)
  }
}
// query tổng hợp để lấy toàn bộ columns và cards thuộc về Board
const getDetail = async (userId, boardId) => {
  try {
    const queryConditions = [
      { _id: new ObjectId(boardId) },
      // Điều kiện 1: Board chưa bị xoá
      { _destroy: false },
      // Điều kiện 2: tìm những trường ownerIds hoặc memberIds có chứa userID
      {
        $or: [
          { ownerIds: { $all: [new ObjectId(userId)] } },
          { memberIds: { $all: [new ObjectId(userId)] } }
        ]
      }
    ]
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            $and: queryConditions
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
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: "ownerIds",
            foreignField: "_id",
            as: "owners",
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
            localField: "memberIds",
            foreignField: "_id",
            as: "members",
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
    return result[0] || null
  } catch (e) {
    throw new Error(e)
  }
}

const pushColumnOrderIds = async (column) => {
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
    return result
  } catch (e) {
    throw new Error(e)
  }
}

const pushMemberIds = async (boardId, userId) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(boardId)
        },
        {
          $push: {
            memberIds: new ObjectId(userId)
          }
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

const update = async (id, updateData) => {
  try {
    // Lọc những field mà không cho phép cập nhật lung tung
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })
    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map((item) => {
        return new ObjectId(item)
      })
    }
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(id)
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

const deleteOneColumnById = async (column) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(column.boardId)
        },
        {
          $pull: {
            columnOrderIds: new ObjectId(column._id)
          }
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

const getBoards = async (userId, page, itemsPage, queryFilters) => {
  try {
    const queryConditions = [
      // Điều kiện 1: Board chưa bị xoá
      { _destroy: false },
      // Điều kiện 2: tìm những trường ownerIds hoặc memberIds có chứa userID
      {
        $or: [
          { ownerIds: { $all: [new ObjectId(userId)] } },
          { memberIds: { $all: [new ObjectId(userId)] } }
        ]
      }
    ]

    // Xử lý query filter cho từng case search board
    if (queryFilters) {
      Object.keys(queryFilters).forEach((key) => {
        // queryFilters[key] ví dụ queryFilters[title] nếu phía FE đẩy lên q[title]

        // Phân biệt chữ hoa, chữ thường
        // queryConditions.push({ [key]: { $regex: queryFilters[key] } })

        // Không phân biệt chữ hoa, thường
        queryConditions.push({
          [key]: { $regex: new RegExp(queryFilters[key], "i") }
        })
      })
    }

    const query = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate(
        [
          {
            $match: {
              $and: queryConditions
            }
          },
          // Sắp xếp theo title board theo A-Z
          {
            $sort: {
              title: 1
            }
          },
          // $facet để xử lý nhiều luồn query cùng lúc
          {
            $facet: {
              // luồng 1: query boards
              queryBoards: [
                // Bỏ qua 12 bản ghi đã lấy của limit trước đó
                {
                  $skip: pagingSkipValue(page, itemsPage)
                },
                // Giới hạn bản ghi trả về trong 1 page
                {
                  $limit: itemsPage
                }
              ],
              // luồng 2: query đếm tổng tất cả số lượng bản ghi boards trong DB và trả về biến countedAllBoards
              queryTotalBoards: [{ $count: "countedAllBoards" }]
            }
          }
        ],
        {
          // Khai báo thêm thuộc tính collation locale 'en' để fix vụ chữ B hoa và a thường ở trên
          collation: { locale: "en" }
        }
      )
      .toArray()
    const res = query[0]
    return {
      boards: res.queryBoards || [],
      totalBoards: res.queryTotalBoards[0]?.countedAllBoards || 0
    }
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
  pushColumnOrderIds,
  update,
  deleteOneColumnById,
  getBoards,
  pushMemberIds
}
