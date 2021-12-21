const {
    Sequelize,
    user: UserModel,
} = require("../models");

const UserAuthController = require('../controllers/UserAuthController');
const bcrypt = require('bcrypt');
const Op = Sequelize.Op;

exports.registerUser = async (req, res) => {
    let phone_number = req.body.phone_number;
    const password = req.body.password;
    const name = req.body.name;
    const wallet = 1000;

    if (phone_number.length != 10) {
        return res.status(400).json({
            success: false,
            errors: 'ขออภัย รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง'
        });
    }

    const old_user = await UserModel.findOne({
        attributes: ['id'],
        where: {
            phone_number: phone_number
        }
    });

    if (old_user) {
        return res.status(409).json({
            success: false,
            errors: 'ขออภัย เบอร์โทรศัพท์หมายเลขนี้ถูกใช้ไปแล้ว'
        });
    }

    const salt = await bcrypt.genSalt(10);

    try {
        const created_user = await UserModel.create({
            phone_number: phone_number,
            password: bcrypt.hashSync(password, salt),
            name : name,
            wallet : wallet
        })

        if(created_user) {
            return res.status(201).json({
                success: true,
                message: `Register Successfully`
            });
        }

    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            errors: err.message
        });
    }
    
}

exports.login = async (req, res) => {
    const {
        phone_number,
        password
    } = req.body;

    try {
        const user = await UserModel.findOne({
            attributes: ['id','phone_number', 'password'],
            where: {
                phone_number: phone_number
            }
        });

        if(!user) {
            return res.status(404).json({
                success: false,
                errors: 'ขออภัย ไม่พบเบอร์โทรศัพท์หมายเลขนี้'
            });
        }

        const check_password = bcrypt.compareSync(password, user.password);

        if (!check_password) {
            return res.status(400).json({
                success: false,
                errors: 'ขออภัย รหัสผ่านไม่ถูกต้อง'
            });
        }

        const token = await UserAuthController.createUserAccessToken(user.id);

        return res.status(200).json({
            success: true,
            accessToken: token,
        });

    } catch(err) {
        console.log(err);
    }
}

exports.Me = async (req, res) => {
    const user_id = req.params.userId;

    const user = await UserModel.findOne({
            attributes: ['id', 'phone_number','name','wallet'],
            where: {
                id: user_id
            }
        });

        // console.log('user',user);
        return res.status(200).json({
            success: true,
            data: user
        });
}
// exports.getUsers = async (req, res) => {

    
// }