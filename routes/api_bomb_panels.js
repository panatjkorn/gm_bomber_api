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
    checkResult
} = require("../controllers/BombPanelsController")

router.get("/",getBombPanels)
router.post("/",createBombPanel)
router.get("/:panel_id",getBombPanelsById)
router.put("/:panel_id/is_playing",isPlayingGame)
router.post("/:panel_id/check_result",checkResult)

module.exports = router