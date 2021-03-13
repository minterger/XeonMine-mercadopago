const indexCtrl = {}
const mp = require("mercadopago");
// const Donator = require('../models/Dontator');
const md5 = require('md5')

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
    // const donatorExist = await Donator.find({name});
    const external_reference = `${Math.floor(Math.random() * 99999999)}`
    // if (!donatorExist) {
    //     const newDonator = new Donator({
    //         name,
    //         email,
    //         external_reference,
    //         totalDonation: catidad,
    //         lastDonation: cantidad
    //     })
    //     try {
    //         await newDonator.save()
    //     } catch (error) {
    //         console.error(error);
    //     }
    // } else {
    //     await Donator.findOneAndUpdate({name}, {external_reference});
    // }
    let preference = {
        items: [
            {
                title: `${name}`,
                description: `Gracias por donar ${email}`,
                quantity: 1,
                currency_id: 'ARS',
                unit_price: parseFloat(cantidad)
            }
        ],
        payer: {
            name: `${name}`,
            email: `${email}`
        },
        external_reference,
        notification_url: `${getFullUrl(req)}/postfeedback`,
        auto_return: "all",
        back_urls: {
            success: `${getFullUrl(req)}/feedback`,
            pending: `${getFullUrl(req)}/feedback`,
            failure: `${getFullUrl(req)}/feedback`
        }
    };

    try {
        const response = await mp.preferences.create(preference);
        // console.log(response);
        console.log(response.body);
        console.log('\n\nEspacio\n');
        console.log('\n\nEspacio\n');

        res.redirect(response.body.init_point);
    } catch(err) {
        res.send(err);
    }
}

indexCtrl.feedback = async (req, res) => {
    // const paymentData = await mp.payment.get(req.query.payment_id)
    const payment = req.query.payment_id;
    const status = req.query.status;
    switch (status) {
        case 'approved':
            res.render('success', { payment, data: req.query })
            break;
        case 'in_process':
            res.render('pending', { payment, data: req.query })
            break;
        case 'rejected':
            res.render('failed', { payment, data: req.query })
            break;
        default:
            break;
    }
    // res.json({
    //     Status: req.query.status,
    //     MerchantOrder: req.query.merchant_order_id,
    //     // Data: req.query,
    //     Payment: req.query.payment_id,
    //     paymentReference: paymentData.response.external_reference,
    //     paymentStatus: paymentData.response.status
    // });
}

indexCtrl.feedbackPost = async (req, res, next) => {
    if (req.body.data) {
        console.log(req.body);
        console.log('\n\nEspacio\n');
        let id = req.body.data.id;
        mp.payment.get(id)
        .then((data) => {
            console.log(data.response.external_reference);
            console.log(data.response.status)
            // res.status(200).send('ok');
            res.status(200).end();
            // res.sendStatus(200);
        })
        .catch((err) => {
            console.error(err);
        })
    }
}

module.exports = indexCtrl;