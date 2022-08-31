const express = require("express")
const router = express.Router()
const {
    authUser
} = require("../middleware/authUser");
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
router.get("/:panel_id",authUser,getBombPanelsById)
router.put("/:panel_id/is_playing",isPlayingGame)
router.post("/:panel_id/check_result/",authUser,checkResult)
router.get("/user/random_panel",authUser,randomPanelToUser)
router.post("/user/buy_panel/",authUser,userBuyPanel)

module.exports = router