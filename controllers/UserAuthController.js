const {
    Sequelize,
    user: UserModel,
} = require("../models");

const config = require('../config/config');
const jwt = require('jsonwebtoken');

const expeired = '8h';

exports.createUserAccessToken = async (user_id) => {
    return jwt.sign({
        id: user_id,
        type: 'login',
    }, config.secret, {
        expiresIn: expeired
    });

};