const axios = require('axios');

exports.initWalletGame = async (req, res) => {
    const token = req.query.token;
    
    //GetUserCredit
    const url = `https://lottery-api-dev-gye6ncwdlq-as.a.run.app/api/v1/game/user-credit?wallet_token=${token}`

    try {
        const getUserCredit = await axios.get(url)
        if(getUserCredit) {
            return res.status(200).json({
                success: true,
                data: getUserCredit.data.data
            });
        }
        
    } catch(error) {
        return res.status(400).json({
            success: false,
            errors: error.message
        });
    }
}