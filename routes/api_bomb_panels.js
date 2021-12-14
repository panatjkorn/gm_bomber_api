const express = require("express")
const router = express.Router()

const {
    getBombPanels,
    createBombPanel,
    getBombPanelsById,
    isPlayingGame,
    checkResult
} = require("../controllers/BombPanelsController")

router.get("/", getBombPanels)
router.post("/", createBombPanel)
router.get("/:panel_id", getBombPanelsById)
router.put("/:panel_id",isPlayingGame)
router.get("/:panel_id/check_result",checkResult)

module.exports = router