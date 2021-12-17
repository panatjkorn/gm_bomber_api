const jwt = require("jsonwebtoken");
const config = require('../config/config');
const UserAuthController = require('../controllers/UserAuthController');

exports.authUser = async (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(403).json({
            success: false,
            errors: "token empty"
        });
    }

    const token = req.headers["authorization"].split(' ')[1];

    if (!token) {
        return res.status(403).json({
            success: false,
            errors: "A token is required for authentication"
        });
    }

    try {

        const decoded = jwt.verify(token, config.secret);

        if (decoded && decoded.type === "login") {
            req.params.userId = decoded.id;

        } else {
            return res.status(401).json({
                success: false,
                errors: 'token invalid'
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            errors: error.message
        });
    }

    return next();
}