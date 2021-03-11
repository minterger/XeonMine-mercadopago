const indexCtrl = {}
const mp = require("mercadopago");
const fetch = require('node-fetch')

mp.configure({
    access_token:"APP_USR-1014301261836371-031015-daaa0cccbdf61be55b9b5e8b72d4e957-726590435"
})
const getFullUrl = (req) =>{
    const url = req.protocol + '://' + req.get('host');
    // console.log(url)
    return url;
}


indexCtrl.renderIndex = (req, res) => {
    res.render('index');
}

indexCtrl.datosDonar = async (req, res) => {
    const {name, email, cantidad} = req.body;
    let preference = {
        items: [
            {
                title: `${name}`,
                description: `${email}`,
                quantity: 1,
                currency_id: 'ARS',
                unit_price: parseFloat(cantidad)
            }
        ],
        payer: {
            name: `${name}`,
            email: `${email}`
        },
        notification_url: `${getFullUrl(req)}/postfeedback`,
        auto_return: "approved",
        back_urls: {
            success: `${getFullUrl(req)}/feedback`,
            pending: `${getFullUrl(req)}/feedback`,
            failure: `${getFullUrl(req)}/feedback`
        }
    };

    try {
        const response = await mp.preferences.create(preference);
        // console.log(response);
        res.redirect(response.body.init_point);
    } catch(err) {
        res.send(err);
    }
}

indexCtrl.feedback = (req, res) => {
    res.json({
        Payment: req.query.payment_id,
        Status: req.query.status,
        MerchantOrder: req.query.merchant_order_id,
        Data: req.query
    });
}

indexCtrl.feedbackPost = async (req, res, next) => {
    if (req.body.data) {
        console.log(req.body.data.id);
        let id = req.body.data.id;
        mp.payment.get(id)
        .then((data) => {
            console.log(data)
            res.status(200);
        })
        .catch((err) => {
            console.error(err);
        })
    }
}

module.exports = indexCtrl;