const express = require("express")
const router = express.Router()
const UserController = require('../controllers/UsersController')
const {
    authUser
} = require("../middleware/authUser");
// const {
//     registerUser,
//     login
// } = require("../controllers/UsersController")

// router.get("/", getUsers)
router.post("/", UserController.registerUser)
router.post("/login", UserController.login)
router.get("/me", authUser,UserController.Me)


module.exports = router