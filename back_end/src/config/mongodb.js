
const { MongoClient, ServerApiVersion } = require("mongodb")
const { env } = require("./environment")
const { MONGODB_URL, DATABASE_NAME } = env


// Create tạo Object trelloDatabaseInstance ban đầu là null vì don't connect
let trelloDatabaseInstance = null


// Create 1 Object mongoCLientInstance để kết nối tới MongoDB
const mongoClientInstance = new MongoClient(MONGODB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// connect to MongoDB
const CONNECT_DB = async () => {
    // Gọi kết nối tới mongoDB Atlas với URL đã khai báo trong thân của clientInstance
    try {
      if (trelloDatabaseInstance) {
        console.log("MongoDB already connected!")
        return
      }
      // Establish connection
      await mongoClientInstance.connect()
      console.log("MongoDB connection successful!")
      // Get the database instance
      // Kết nối thành công thì lấy ra db theo tên và gán ngược lại vào biến
      // trelloDatabaseInstance ở trên khi mới khai báo là null
      trelloDatabaseInstance = mongoClientInstance.db(DATABASE_NAME)
      // console.log(trelloDatabaseInstance)
    } catch (err) {
      console.error("Failed to connect to MongoDB:", err)
      throw new Error("MongoDB connection failed!")
    }
}

const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error("Must connect to database first!")
    return trelloDatabaseInstance
}

const CLOSE_DB = async () => {
  console.log("Disconnecting from MongoDB")
  await mongoClientInstance.close()
}
module.exports = { CONNECT_DB, GET_DB, CLOSE_DB }