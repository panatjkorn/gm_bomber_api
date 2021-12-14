const {
    bomb_panel: bomb_panelModel
} = require("../models")

exports.getBombPanels = async (req, res) => {

    // return res.status(200).json({
    //     success: true,
    //     message: "test",
    //     data : 'testxxx'
    // })

    try {

        const page = req.query.page
        const limit = req.query.limit
        const offset = page ? page * limit : 0

        //test
        // const admin = await AdminModel.findOne({
        //     attributes: ['id', 'password', 'is_active'],
        //     include: [{
        //         model: PermissionModel,
        //         attributes: ['permissions']
        //     },{
        //         model: asda,
        //         attributes: ['permissions']
        //     }],
        //     where: {
        //         username: username
        //     }
        // })

        const bombs = await bomb_panelModel.findAll({
            attributes: ['id'],
            where: {
                is_playing: false
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
    console.log('req',req.body);
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
        is_won : null,
        is_playing : false,
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

    try {
        const panel = await bomb_panelModel.findOne({
            attributes: ['id','panel_name','open_panel','open_panel_default','is_won'],
            where: {
                id: panel_id
            },
        })
        let _data = {
            id : panel.id,
            is_won : panel.is_won,
            default_panel : []
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

    const updatePlayingGame = {
        is_playing : true
    }

    try {

        const findPanel = await bomb_panelModel.findOne({
            attributes: ['id'],
            where: {
                id: panel_id,
                is_playing : false
            },
        })
        
        if(findPanel) {
            const updatePlayingPanel = await bomb_panelModel.update(updatePlayingGame, {
                where: {
                    id: panel_id
                }
            })

            if (updatePlayingPanel[0] > 0) {
                return res.status(200).json({
                    success: true,
                    message: `บันทึกสำเร็จ`
                })
            }
        }

    } catch (error) {
        return res.status(400).json({
            success: false,
            errors: error.message
        })
    }
    
    // try {
    //     const panel = await bomb_panelModel.findOne({
    //         attributes: ['id','panel_name','panel_default_ex','is_won'],
    //         where: {
    //             id: panel_id
    //         },
    //     })

    //     if (panel) {
    //         return res.status(200).json({
    //             success: true,
    //             data: panel
    //         })
    //     }

    //     return res.status(404).json({
    //         success: false,
    //         errors: `panel not found!`
    //     })

    // } catch(err) {
    //     console.log(err);
    // }
}

exports.checkResult = async (req, res) => {
    const {
        panel_id
    } = req.params

    if(parseInt(req.query.click_at) >= 0 && parseInt(req.query.click_at) < 9) {
        const click_at = parseInt(req.query.click_at)

        try {
            const panel = await bomb_panelModel.findOne({
                attributes: ['id','panel_default','open_panel','open_panel_default'],
                where: {
                    id: panel_id
                },
            })

            if(panel.open_panel.includes(click_at)) {
                return res.status(409).json({
                    success: false,
                    errors: 'ขออภัยช่องนี้ถูกเลือกไปแล้ว'
                });
            }

            panel.open_panel.push(click_at)
            
            if(panel) {
                if(panel.dataValues.panel_default[click_at] == true) {
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
                        this.setPanelWon({status : true , panel_id :panel_id});
                    }
                    return res.status(200).json({
                        success: true,
                        data: true
                    })
                } else {
                    // console.log('boom!!');
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
    } else {
        return res.status(409).json({
            success: false,
            errors: 'กรุณาระบุค่าให้ถูกต้อง'
        })
    }
    
}

exports.setPanelWon = async (req, res) => {
    const updateWon = await bomb_panelModel.update({
        is_won: req.status,
    }, {
        where: {
            id: req.panel_id
        }
    })
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
    // const randomElement = bombArray[Math.floor(Math.random() * 10)];
    const shuffledArray = bombArray.sort((a, b) => 0.5 - Math.random());
    for(let i = 0; i < shuffledArray.length; i++) {
        if(shuffledArray[i] == false) {
            console.log('i',i);
            //ระเบิดคือ 0
            arrayEx.push(i)
        }
        // console.log('arrayEx.length',arrayEx.length);
    }
    arrayEx.splice(3, 2)
    let shuffleArrayEx = arrayEx.sort((a, b) => 0.5 - Math.random())
    
    // console.log('shuffleArrayEx',shuffleArrayEx);
    
    return arrayGenerate = [{
        shuffledArray : shuffledArray,
        shuffleArrayEx : shuffleArrayEx
    }]
    // return shuffledArray;
    
}