require('dotenv').config(); 
const express = require("express")

const welcomeRouter = require("./welcome/welcomeRouter")
const userRouter = require("./users/userRouter")
const postRouter = require("./posts/postRouter")
const logger = require("./middleware/logger")

const server = express()
const port = process.env.PORT || 4000;

server.use(welcomeRouter)
server.use(logger())

server.use("/api/users", userRouter)
server.use("/api/posts", postRouter)

server.use(express.json())




// make error middleware last, anything with four params is considered error middleware. 
// catches errors from the other middleware functions
// replace catch with .catch(next) or .catch(error) {next()}
server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		message: "Something when wrong, try again later",
	})
})


server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
