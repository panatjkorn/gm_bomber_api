const express = require("express")
const router = express.Router()

const {
    initWalletGame,
} = require("../controllers/GameWalletController")


// router.get("/init_wallet",initWalletGame)

module.exports = router