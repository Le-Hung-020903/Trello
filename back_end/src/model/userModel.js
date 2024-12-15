const Joi = require("joi")
const { ObjectId } = require("mongodb")
const { GET_DB } = require("~/config/mongodb")
const { EMAIL_RULE, EMAIL_RULE_MESSAGE  } = require("../utils/validators")
const USER_ROLES = {
    CLIENT: "client",
    ADMIN: "admin"
}

const USER_COLLECTION_NAME = "users"
const USER_COLLECTION_SCHEMA = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    password: Joi.string().required(),
    username: Joi.string().required().trim().strict(),
    displayName: Joi.string().required().trim().strict(),
    avatar: Joi.string().default(null),
    role: Joi.string().valid(USER_ROLES.CLIENT, USER_ROLES.ADMIN).default(USER_ROLES.CLIENT),
    isActive: Joi.boolean().default(false),
    verifyToken: Joi.string(),
    createdAt: Joi.date().timestamp("javascript").default(Date.now),
    updatedAt: Joi.date().timestamp("javascript").default(null),
    _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ["_id", "email", "username", "createdAt"]

const validateBeforeCreate = async (data) => {
    return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const register = async (data) => {
    try {
        const valiData = await validateBeforeCreate(data)
        const result = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(valiData)
        return result
    } catch (e) {
        throw new Error(e)
    }
}
const findOneByEmail = async (email) => {
    try {
        const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
            email: email
        })
        return result
    } catch (e) {
        throw new Error(e)
    }
}

const findOneById = async (id) => {
    try {
        const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (e) {
        throw new Error(e)
    }
}
module.exports = {
    register,
    findOneByEmail,
    findOneById,
    USER_COLLECTION_NAME,
    USER_COLLECTION_SCHEMA
}