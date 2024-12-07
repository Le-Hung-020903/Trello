const columnModel = require("../model/columnModel")
const boardModel = require("~/model/boardModel")
module.exports = {
    createNewColumn: async (reqBody) => {
        try {
            const newColumn = {
                ...reqBody
            }
            const createNewColumn = await columnModel.createNewColumn(newColumn)
            const getNewColumn = await columnModel.findOneById(createNewColumn.insertedId)
            if (getNewColumn) {
                // xử lý cấu trúc data ở đây trước khi trả dữ liệu về
                getNewColumn.cards = []
                // thêm sự kiện để đưa id column mới vào columnOrderIds
                await boardModel.pushColumnOrderIds(getNewColumn)
            }
            return getNewColumn
        } catch (e) {
            throw e
        }
    }
}
