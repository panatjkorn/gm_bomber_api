const express = require("express");
const router = express.Router()
const api_bomb_panels = require('./api_bomb_panels')
const api_game_wallet = require('./api_game_wallet')
const api_data = require('./api_data')

router.use('/v1/bomb_panels', api_bomb_panels)
router.use('/v1/wallet_game', api_game_wallet)
router.use('/v1/data', api_data)

module.exports = router