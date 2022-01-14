const express = require("express")
const router = express.Router()

const {
    getPanelPrice
} = require("../controllers/DataController")

router.get("/get_panel_price",getPanelPrice)

module.exports = router