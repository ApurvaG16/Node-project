const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const cors = require("cors")
const connectDb = require("./config/db")
const errorMiddleware = require("./middleware/errorMiddleware")
const authRoutes = require("./routes/authRoutes")
const noteRoutes = require("./routes/noteRoutes")

dotenv.config()
connectDb()
const app = express()
module.exports = app;
app.use(express.json())
app.use(morgan("dev"))
app.use(cors())


app.use("/api/jio", authRoutes)
app.use("/api/jio", noteRoutes)


app.use(errorMiddleware)
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
    console.log("Server Connected")
})