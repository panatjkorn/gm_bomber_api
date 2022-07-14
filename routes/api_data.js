const express = require("express")
const router = express.Router()

const {
    getPanelPrice,
    ResultLottoHanoi
} = require("../controllers/DataController")

router.get("/get_panel_price",getPanelPrice)

router.post("/result/lottos/hanoi",ResultLottoHanoi)

module.exports = router