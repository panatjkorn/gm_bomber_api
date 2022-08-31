// const axios = require('axios');

// exports.initWalletGame = async (req, res) => {
//     const token = req.query.token;
    
//     //GetUserCredit
//     const url = `https://demo-game-api-dev-76iziw7aaq-as.a.run.app/api/v1/user-game/credit?wallet_token=${token}`

//     try {
//         const getUserCredit = await axios.get(url)
//         // console.log('getUserCredit',getUserCredit);
//         if(getUserCredit) {
//             return res.status(200).json({
//                 success: true,
//                 data: getUserCredit.data.data
//             });
//         }
        
//     } catch(error) {
//         return res.status(400).json({
//             success: false,
//             errors: error.message
//         });
//     }
// }