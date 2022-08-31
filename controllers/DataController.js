const {
    panel_price: PanelPriceModel,
} = require("../models")
const axios = require('axios');
const cheerio = require('cheerio');

exports.getPanelPrice = async (req, res) => {
    try {
        const getDataPanelPrice = await PanelPriceModel.findAll({
            attributes: ['id', 'price_name', 'price'],
        })
        const panelPrice = getDataPanelPrice.map(item => {
            return {
                id: item.id,
                price_name: item.price_name,
                price: item.price
            }
        })

        return res.status(200).json({
            success: true,
            data: panelPrice
        })

    } catch(err) {
        console.log(err);
    }
}

// exports.ResultLottoHanoi = async (req, res) => {

//     const {
//         round_id
//     } = req.query;

//     const {
//         adminId
//     } = req.params;

//     try {

//         let response = null;
//             const url = `https://www.ruay.at`
//             // const url = `https://www.ruay.at/%e0%b8%95%e0%b8%a3%e0%b8%a7%e0%b8%88%e0%b8%ab%e0%b8%a7%e0%b8%a2%e0%b8%ae%e0%b8%b2%e0%b8%99%e0%b8%ad%e0%b8%a2/`

//             const lottoHanoi = await axios.get(url)
//             console.log('lottoHanoi',lottoHanoi);
//             return res.status(200).json({
//                 success: true,
//                 data: lottoHanoi
//             });
//             // const $ = cheerio.load(lottoHanoi.data)

//             // const date = $('#page > #content > div > section:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(1) > div > div > div > section > div > div > div > div > div > table > tbody > tr:nth-child(1) > td > span > span:nth-child(2)').text().trim()
//             // const fitrst_prize = $('#page > #content > div > section:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(1) > div > div > div > section > div > div > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(2) > span > span > b').text().trim()
//             // const last_two_prize = $('#page > #content > div > section:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(1) > div > div > div > section > div > div > div > div > div > table > tbody > tr:nth-child(4) > td:nth-child(2) > span > span > b').text().trim()

//             // response = {
//             //     "date": `${date.split(" ")[1]} ${date.split(" ")[2]} ${date.split(" ")[3]}`,
//             //     "first_prize": fitrst_prize,
//             //     "last_two_prize": last_two_prize
//             // }

//             // // console.log('response',response);

//             // if (!fitrst_prize || fitrst_prize == '' || !last_two_prize || last_two_prize == '') {
//             //     return res.status(400).json({
//             //         success: false,
//             //         errors: `ผลยังไม่ออก`
//             //     });
//             // }

//             // return res.status(200).json({
//             //     success: true,
//             //     data: response
//             // });

//     } catch (error) {
//         return res.status(400).json({
//             success: false,
//             errors: error
//         });
//     }

// };

