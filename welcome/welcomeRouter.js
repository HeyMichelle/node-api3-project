const express = require("express")

const router = express.Router()

router.get("/", (req, res) => {
	res.json({
		message: "Welcome to Express with Middleware",
	})
})

module.exports = router