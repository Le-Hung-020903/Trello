
var createError = require("http-errors")
var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
const cors = require("cors")
var app = express()
const { corsOptions } = require("./config/cors")
const { errorHandlingMiddleware } = require('../src/middlewares/errorHandlingMiddleware')
const indexRouters = require("../src/routes/v1/index")


app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
// xử lý cors
app.use(cors(corsOptions))
// routes web
app.use("/v1", indexRouters)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
// app.use(function (err, req, res) {
//   // set locals, only providing error in development
//   res.locals.message = err.message
//   res.locals.error = req.app.get("env") === "development" ? err : {}

//   // render the error page
//   res.status(err.status || 500)
//   res.json({ error: err.message })
// })
app.use(errorHandlingMiddleware)

module.exports = app
