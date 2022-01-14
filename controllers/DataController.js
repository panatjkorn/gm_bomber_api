const {
    panel_price: PanelPriceModel,
} = require("../models")

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

