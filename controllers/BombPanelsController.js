const {
    bomb_panel: bomb_panelModel,
    user : userModel
} = require("../models")

const axios = require('axios');

exports.getBombPanels = async (req, res) => {

    try {

        const page = req.query.page
        const limit = req.query.limit
        const offset = page ? page * limit : 0

        const bombs = await bomb_panelModel.findAll({
            attributes: ['id'],
            where: {
                uu_id : null
            },
        })
        
        return res.status(200).json({
            success: true,
            data: bombs
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message
        })
    }
}

exports.createBombPanel = async (req, res) => {
    const {
        panel_name,
        total_bomb,
    } = req.body
    
    const generateBomb = await generateNumber(total_bomb)
    const _data = {
        panel_name : panel_name,
        total_bomb : total_bomb,
        panel_default : generateBomb[0].shuffledArray,
        panel_default_ex : generateBomb[0].shuffleArrayEx,
        open_panel : generateBomb[0].shuffleArrayEx,
        open_panel_default : [0,0,0],
        uu_id : null,
        panel_price : null,
        is_won : null,
    }

    // return res.status(200).json({})
    try {
        const createBomb = await bomb_panelModel.create(_data)
        // console.log('createBomb',createBomb);
        return res.status(201).json({
            success: true,
            message: 'created Bomb Panel success',
            // data : _data
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message
        })
    }

}

exports.getBombPanelsById = async (req, res) => {
    const {
        panel_id
    } = req.params

    const {
        uuId
    } = req.query

    try {
        const panel = await bomb_panelModel.findOne({
            attributes: ['id','panel_name','open_panel','open_panel_default','is_won','uu_id','panel_price'],
            where: {
                id: panel_id
            },
        })
        let _data = {
            id : panel.id,
            is_won : panel.is_won,
            uu_id : panel.uu_id,
            price : panel.panel_price,
            default_panel : []
        }
        // console.log('_data.uu_id',_data.uu_id);
        // console.log('uu_idxxx',uuId);
        if(_data.uu_id != uuId && _data.uu_id != null) {
            return res.status(400).json({
                success: false,
                errors: 'Token Faild',
            })
        }

        for(let i = 0; i < panel.open_panel.length; i++) {
            _data.default_panel.push({
                open_panel : panel.open_panel[i],
                open_panel_default : panel.open_panel_default[i],
            })
        }

        if (panel) {
            return res.status(200).json({
                success: true,
                data: _data
            })
        }

        return res.status(404).json({
            success: false,
            errors: `panel not found!`
        })

    } catch(error) {
        return res.status(400).json({
            success: false,
            errors: error.message
        })
    }
}


exports.isPlayingGame = async (req, res) => {
    const {
        panel_id
    } = req.params

    const {
        uu_id,
        panel_price,
        token
    } = req.body

    const findPanelDontHaveUserToPlay = await bomb_panelModel.findOne({
        attributes: ['id'],
        where: {
            id: panel_id,
            uu_id : null
        },
    })

    if(!findPanelDontHaveUserToPlay) {
        return res.status(400).json({
            success: false,
            message: `ตารางนี้มี user เล่นไปแล้ว`,
        })
    }
    
    
    if(parseInt(panel_price) <=0 || parseInt(panel_price) > 500) {
        return res.status(400).json({
            success: false,
            message: `จำนวนเงินไม่ถูกต้อง`,
        })
    }

    //GetUserCredit
    const url = `https://lottery-api-dev-gye6ncwdlq-as.a.run.app/api/v1/game/user-credit?wallet_token=${token}`

    try {
        const getUserCredit = await axios.get(url)

        if(getUserCredit && getUserCredit.data.data.points >= panel_price) {
            try {
                const updatePlayingGame = {
                    uu_id : uu_id,
                    panel_price : panel_price
                }
        
                const updatePlayingPanel = await bomb_panelModel.update(updatePlayingGame, {
                    where: {
                        id: panel_id
                    }
                })
        
                if(!updatePlayingPanel) {
                    return res.status(400).json({
                        success: false,
                        errors: error.message
                    })
                }
                    
                //ตัด point ตอนเล่น
                const _data = {
                    modify_cost : -panel_price,
                    wallet_token : token
                }

                console.log('_data',_data);
        
                const url = `https://lottery-api-dev-gye6ncwdlq-as.a.run.app/api/v1/game/modify-credit`
        
                try {
                    const modifyCredit = await axios.post(url,_data)
                    console.log('modifyCredit',modifyCredit);
                    
                } catch(error) {
                    return res.status(400).json({
                        success: false,
                        errors: error.message
                    });
                }
        
                // const userPayMoneyToBuyPanel = await userModel.update({
                //     wallet : findUserIsHave.wallet - panel_price
                // }, {
                //     where: {
                //         id: user_id
                //     }
                // })
        
                // if(!userPayMoneyToBuyPanel) {
                //     return res.status(400).json({
                //         success: false,
                //         errors: error.message
                //     })
                // }
        
                // return res.status(200).json({
                //     success: true,
                //     message : 'บันทึกสำเร็จ'
                // })
        
        
            } catch(err) {
                return res.status(400).json({
                    success: false,
                    errors: err.message
                })
            }
        } else {
            return res.status(400).json({
                success: false,
                errors: 'จำนวนเงินไม่เพียงพอ'
            })
        }
        
    } catch(error) {
        return res.status(400).json({
            success: false,
            errors: error.message
        });
    }
}

exports.checkResult = async (req, res) => {
    const {
        panel_id
    } = req.params

    const {
        uu_id,
        b,
        tk,
        click_at
    } = req.body

    let token = `${b}[SALT]${tk}[SALT]${uu_id}`

    if(parseInt(click_at) >= 0 && parseInt(click_at) < 9) {
        const click_at_panel = parseInt(click_at)

        const panel = await bomb_panelModel.findOne({
            attributes: ['id','panel_default','open_panel','open_panel_default','uu_id','panel_price','is_won'],
            where: {
                id: panel_id
            },
        })

        if(panel.uu_id != null && panel.uu_id != uu_id) {
            return res.status(400).json({
                success: false,
                errors: 'ขออภัยมี user เล่นแผ่นนี้ไปแล้ว'
            });
        }

        if(panel.is_won != null) {
            return res.status(400).json({
                success: false,
                errors: 'ขออภัยมีเกมได้จบลงแล้ว'
            });
        }


        if(panel.open_panel.includes(click_at_panel)) {
            return res.status(400).json({
                success: false,
                errors: 'ขออภัยช่องนี้ถูกเลือกไปแล้ว'
            });
        }

        panel.open_panel.push(click_at_panel)

        if(panel) {
            if(panel.dataValues.panel_default[click_at_panel] == true) {
                panel.open_panel_default.push(1)
                const updateUserClick = await bomb_panelModel.update({
                    open_panel: panel.open_panel,
                    open_panel_default : panel.open_panel_default
                }, {
                    where: {
                        id: panel_id
                    }
                })
                
                let countChoiceTrue =  0;
                for(let i = 0; i < panel.open_panel_default.length; i++) {
                    if(panel.open_panel_default[i] == 1) {
                        countChoiceTrue++;
                    }
                }

                if(countChoiceTrue == 4) {
                    const _data = {
                        status : true , 
                        panel_id :panel_id, 
                        panel_price : panel.panel_price,
                        token : token
                    }

                    this.setPanelWon(_data);
                    // this.setRewardUserWon({uu_id:uu_id, panel_price : panel.panel_price,status : true})
                }
                return res.status(200).json({
                    success: true,
                    data: true
                })
            } else {
                panel.open_panel_default.push(0)
                const updateUserClick = await bomb_panelModel.update({
                    open_panel: panel.open_panel,
                    open_panel_default : panel.open_panel_default
                }, {
                    where: {
                        id: panel_id
                    }
                })
                
                
                this.setPanelWon({status : false , panel_id :panel_id});
                return res.status(200).json({
                    success: true,
                    data: false
                })
            }
        }
 
    } else {
        return res.status(400).json({
            success: false,
            errors: 'กรุณาระบุค่าให้ถูกต้อง'
        })
    }
}

exports.setPanelWon = async (req, res) => {
    const updateWon = await bomb_panelModel.update({
        is_won: req.status,
        user_reward : req.status == true ? req.panel_price * 3 : 0
    }, {
        where: {
            id: req.panel_id
        }
    })

    if(updateWon && req.status == true) {
        const  _data = {
            modify_cost: req.panel_price * 3,
            wallet_token: req.token
        }

        this.modifyCreditUser(_data)
    }
}

async function generateNumber(total_bomb) {
    let totalSlot = 9
    let bombInSlot = total_bomb

    let bomb = 1
    let bombArray = [];
    let arrayEx = []
    for(let i = 0; i < totalSlot; i++) {
        //ระเบิดคือ 0
        if(i < bombInSlot) {
            bombArray.push(0)
        } else {
            bombArray.push(1)
        }

        bomb++;
    }

    const shuffledArray = bombArray.sort((a, b) => 0.5 - Math.random());
    for(let i = 0; i < shuffledArray.length; i++) {
        if(shuffledArray[i] == false) {
            //ระเบิดคือ 0
            arrayEx.push(i)
        }
    }
    arrayEx.splice(3, 2)
    let shuffleArrayEx = arrayEx.sort((a, b) => 0.5 - Math.random())
    
    
    return arrayGenerate = [{
        shuffledArray : shuffledArray,
        shuffleArrayEx : shuffleArrayEx
    }]
}

//new v.
exports.randomPanelToUser = async (req, res) => {
    
    const bombs = await bomb_panelModel.findAll({
        attributes: ['id'],
        where: {
            uu_id : null
        },
    })
    
    let arrayPanelId = []
    for(let i = 0; i < bombs.length; i++) {
        arrayPanelId.push(bombs[i].id)
    }

    const shuffledArray = arrayPanelId.sort((a, b) => 0.5 - Math.random());

    let panelId = shuffledArray[0]

    const rdPanelToUser = await bomb_panelModel.findAll({
        attributes: ['id','panel_name','open_panel','open_panel_default','is_won','uu_id','panel_price'],
        where: {
            id : panelId
        },
    })

    

    if(rdPanelToUser) {

        let _data = {
            id : rdPanelToUser[0].id,
            is_won : rdPanelToUser[0].is_won,
            uu_id : rdPanelToUser[0].uu_id,
            price : rdPanelToUser[0].panel_price,
            default_panel : []
        }

        // console.log('rdPanelToUser',rdPanelToUser);
        for(let i = 0; i < rdPanelToUser[0].open_panel.length; i++) {
            _data.default_panel.push({
                open_panel : rdPanelToUser[0].open_panel[i],
                open_panel_default : rdPanelToUser[0].open_panel_default[i],
            })
        }

        return res.status(200).json({
            success: true,
            data: _data
        })
    }
}

exports.userBuyPanel = async (req, res) => {
    const {
        uu_id,
        panel_price,
        panel_id,
        b,
        tk,
    } = req.body

    let token = `${b}[SALT]${tk}[SALT]${uu_id}`

    const url = `https://lottery-api-dev-gye6ncwdlq-as.a.run.app/api/v1/game/user-credit?wallet_token=${token}`
    try {
        const getUserCredit = await axios.get(url)
        let user_credit = await getUserCredit.data.data.credit;
        if(user_credit < panel_price) {
            return res.status(400).json({
                success: false,
                errors: 'จำนวนเงินไม่เพียงพอ'
            })
        }

    } catch(err) {
        return res.status(400).json({
            success: false,
            errors: error.message
        })
    }

    try {

        const getPanelById = await bomb_panelModel.findOne({
            attributes: ['id','panel_name','open_panel','open_panel_default','is_won','uu_id','panel_price'],
            where: {
                id: panel_id,
                uu_id : null
            },
        })
        // console.log('getPanelById',getPanelById.id);

        if(!getPanelById) {
            return res.status(400).json({
                success: false,
                message: `ตารางนี้มี user เล่นไปแล้ว`,
            })
        }

        if(getPanelById) {
            const updatePlayingGame = {
                uu_id : uu_id,
                panel_price : panel_price,
            }
    
            const updatePlayingPanel = await bomb_panelModel.update(updatePlayingGame, {
                where: {
                    id: getPanelById.id
                }
            })
            
            if(updatePlayingPanel) {
                //ตัด point ตอนเล่น
                const _data = {
                    modify_cost : -panel_price,
                    wallet_token : token,
                }

                this.modifyCreditUser(_data)
            }
            // console.log('updatePlayingPanel',updatePlayingPanel);
        }

    } catch(error) {
        return res.status(400).json({
            success: false,
            errors: error.message
        })
    }
}

//ตัดเงิน user หงฟ้า
exports.modifyCreditUser = async (req, res) => {
    const  _data = {
        modify_cost: req.modify_cost,
        wallet_token: req.wallet_token
    }

    const url = `https://lottery-api-dev-gye6ncwdlq-as.a.run.app/api/v1/game/modify-credit`

    try {
        const modifyCredit = await axios.post(url,_data)
        return res.status(200).json({
            success: true,
            data: modifyCredit.data
        })
        
    } catch(error) {
        return res.status(400).json({
            success: false,
            errors: error.message
        });
    }
}


// exports.isPlayingGame = async (req, res) => {
//     const {
//         panel_id
//     } = req.params

//     const {
//         uu_id,
//         panel_price,
//         token
//     } = req.body

//     const findPanelDontHaveUserToPlay = await bomb_panelModel.findOne({
//         attributes: ['id'],
//         where: {
//             id: panel_id,
//             uu_id : null
//         },
//     })

//     if(!findPanelDontHaveUserToPlay) {
//         return res.status(400).json({
//             success: false,
//             message: `ตารางนี้มี user เล่นไปแล้ว`,
//         })
//     }
    
    
//     if(parseInt(panel_price) <=0 || parseInt(panel_price) > 500) {
//         return res.status(400).json({
//             success: false,
//             message: `จำนวนเงินไม่ถูกต้อง`,
//         })
//     }

//     //GetUserCredit
//     const url = `https://lottery-api-dev-gye6ncwdlq-as.a.run.app/api/v1/game/user-credit?wallet_token=${token}`

//     try {
//         const getUserCredit = await axios.get(url)

//         if(getUserCredit && getUserCredit.data.data.points >= panel_price) {
//             try {
//                 const updatePlayingGame = {
//                     uu_id : uu_id,
//                     panel_price : panel_price
//                 }
        
//                 const updatePlayingPanel = await bomb_panelModel.update(updatePlayingGame, {
//                     where: {
//                         id: panel_id
//                     }
//                 })
        
//                 if(!updatePlayingPanel) {
//                     return res.status(400).json({
//                         success: false,
//                         errors: error.message
//                     })
//                 }
                    
//                 //ตัด point ตอนเล่น
//                 const _data = {
//                     modify_cost : -panel_price,
//                     wallet_token : token
//                 }

//                 console.log('_data',_data);
        
//                 const url = `https://lottery-api-dev-gye6ncwdlq-as.a.run.app/api/v1/game/modify-credit`
        
//                 try {
//                     const modifyCredit = await axios.post(url,_data)
//                     console.log('modifyCredit',modifyCredit);
                    
//                 } catch(error) {
//                     return res.status(400).json({
//                         success: false,
//                         errors: error.message
//                     });
//                 }
        
//                 const userPayMoneyToBuyPanel = await userModel.update({
//                     wallet : findUserIsHave.wallet - panel_price
//                 }, {
//                     where: {
//                         id: user_id
//                     }
//                 })
        
//                 if(!userPayMoneyToBuyPanel) {
//                     return res.status(400).json({
//                         success: false,
//                         errors: error.message
//                     })
//                 }
        
//                 return res.status(200).json({
//                     success: true,
//                     message : 'บันทึกสำเร็จ'
//                 })
        
        
//             } catch(err) {
//                 return res.status(400).json({
//                     success: false,
//                     errors: err.message
//                 })
//             }
//         } else {
//             return res.status(400).json({
//                 success: false,
//                 errors: 'จำนวนเงินไม่เพียงพอ'
//             })
//         }
        
//     } catch(error) {
//         return res.status(400).json({
//             success: false,
//             errors: error.message
//         });
//     }
// }

