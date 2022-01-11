const express = require("express")
const router = express.Router()

const {
    getBombPanels,
    createBombPanel,
    getBombPanelsById,
    isPlayingGame,
    checkResult,
    randomPanelToUser,
    userBuyPanel
} = require("../controllers/BombPanelsController")

router.get("/",getBombPanels)
router.post("/",createBombPanel)
router.get("/:panel_id",getBombPanelsById)
router.put("/:panel_id/is_playing",isPlayingGame)
router.post("/:panel_id/check_result",checkResult)
router.get("/user/random_panel",randomPanelToUser)
router.post("/user/buy_panel",userBuyPanel)

module.exports = router