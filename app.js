const express = require('express')
const port = process.env.PORT
const userRouter = require('./routers/user')
const courseRouter = require('./routers/course')
require('./db/db')
const cors = require("cors");

const app = express()

app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true,
    })
);

app.use(express.json())
app.use(userRouter)
app.use(courseRouter)

app.listen(8080, () => {
    console.log(`Server running on port 8080`)
})