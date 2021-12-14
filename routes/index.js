const express = require("express");
const router = express.Router()
const api_users = require('./api_users')
const api_bomb_panels = require('./api_bomb_panels')

router.use('/v1/users', api_users)
router.use('/v1/bomb_panels', api_bomb_panels)

module.exports = router