const express = require("express")
const router = express.Router()
const UserController = require('../controllers/UsersController')
// const {
//     authUser
// } = require("../middleware/authUser");

// router.get("/", getUsers)
router.post("/", UserController.registerUser)
router.post("/login", UserController.login)
// router.get("/me", UserController.Me)


module.exports = router