const indexCtrl = {}
const mp = require("mercadopago");
const Donator = require('../models/Dontator');
const LastDonation = require("../models/LastDonation");
const md5 = require('md5');

mp.configure({
    sandbox: true,
    access_token:"APP_USR-1014301261836371-031015-daaa0cccbdf61be55b9b5e8b72d4e957-726590435"
})

const sumarDias = (fecha, dias) => {
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString();
}
const getFullUrl = (req) =>{
    const url = req.protocol + '://' + req.get('host');
    // console.log(url)
    return url;
}

indexCtrl.renderIndex = async (req, res) => {
    const top = await Donator.find({}).sort({totalDonation: -1}).limit(5).lean()
    const last = await LastDonation.find({statusLast: 1}).sort({updatedAt: -1}).limit(5).lean()
    res.render('index', {top, last});
}

indexCtrl.datosDonar = async (req, res) => {
    const { cantidad } = req.body;
    const { name, email, _id } = req.user;
    console.log(name, email, cantidad);
    const external_reference = `${Math.floor(Math.random() * 99999999)}`
    const newDonator = new LastDonation({
        name,
        email,
        userId: _id,
        external_reference,
        lastDonation: cantidad,
        gravatar: `${md5(email)}`
    })
    try {
        await newDonator.save()
    } catch (error) {
        console.error(error);
    }
    let preference = {
        items: [
            {
                title: `Donacion XeonMine Server`,
                description: `Donacion de parte de nombre: ${name}, email: ${email}`,
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
        statement_descriptor: 'XeonMine Server',
        payment_methods: {
            excluded_payment_types: [
                {
                    id: 'ticket'
                },
                {
                    id: 'atm'
                }
            ],
        },
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
    const payment = req.query.payment_id;
    const external_reference = req.query.external_reference;
    const status = req.query.status;
    switch (status) {
        case 'approved':
            const lastDonation = await LastDonation.findOne({external_reference});
            const donator = await Donator.findOne({userId: lastDonation.userId});
            if (lastDonation.statusLast == 0) {
                if (!donator) {
                    const newDonator = new Donator({
                        name: lastDonation.name,
                        email: lastDonation.email,
                        userId: lastDonation.userId,
                        totalDonation: lastDonation.lastDonation,
                        gravatar: `${md5(lastDonation.email)}`
                    })
                    try {
                        await newDonator.save()
                    } catch (error) {
                        console.error(error);
                    }
                    await LastDonation.findOneAndUpdate({external_reference}, {statusLast: 1, status: 'Pagado'});
                } else {
                    const totalDonation = parseFloat(donator.totalDonation) + parseFloat(lastDonation.lastDonation);
                    await Donator.findByIdAndUpdate(donator._id, {totalDonation})
                    await LastDonation.findOneAndUpdate({external_reference}, {statusLast: 1});
                }
            }
            res.render('success', { payment, data: req.query })
            break;
        case 'in_process':
            await LastDonation.findOneAndUpdate({external_reference}, {statusLast: 2, status: 'Pendiente'});
            res.render('pending', { payment, data: req.query })
            break;
        case 'rejected':
            await LastDonation.findOneAndUpdate({external_reference}, {statusLast: 3, status: 'Rechazado'});
            res.render('failed', { payment, data: req.query })
            break;
        default:
            await LastDonation.findOneAndDelete({external_reference})
            res.render('failed', { payment, data: req.query })
            break;
    }
}

indexCtrl.feedbackPost = async (req, res, next) => {
    if (req.method == 'POST') {
        res.status(200).send('ok');
        if (req.body.data) {
            console.log(req.body);
            console.log('\n\nEspacio\n');
            let id = req.body.data.id;
            try {
                const data = await mp.payment.get(id)
                // res.status(200).end();
                // res.status(200).send('ok');
                // res.status(200).json({
                //     success: true,
                //     message: 'Works'
                // })
                console.log(data.response.external_reference);
                console.log(data.response.status)
                const external_reference = data.response.external_reference;
                const status = data.response.status;
                switch (status) {
                    case 'approved':
                        const lastDonation = await LastDonation.findOne({external_reference});
                        const donator = await Donator.findOne({userId: lastDonation.userId});
                        if (lastDonation.statusLast == 0) {
                            if (!donator) {
                                const newDonator = new Donator({
                                    name: lastDonation.name,
                                    email: lastDonation.email,
                                    userId: lastDonation.userId,
                                    totalDonation: lastDonation.lastDonation,
                                    gravatar: `${md5(lastDonation.email)}`
                                })
                                await newDonator.save()
                                await LastDonation.findOneAndUpdate({external_reference}, {statusLast: 1, status: 'Pagado'});
                            } else {
                                const totalDonation = parseFloat(donator.totalDonation) + parseFloat(lastDonation.lastDonation);
                                await Donator.findByIdAndUpdate(donator._id, {totalDonation})
                                await LastDonation.findOneAndUpdate({external_reference}, {statusLast: 1});
                            }
                        }
                        break;
                    case 'in_process':
                        await LastDonation.findOneAndUpdate({external_reference}, {statusLast: 2, status: 'Pendiente'});
                        break;
                    case 'rejected':
                        await LastDonation.findOneAndUpdate({external_reference}, {statusLast: 3, status: 'Rechazado'});
                        break;
                    default:
                        await LastDonation.findOneAndDelete({external_reference})
                        break;        
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}

module.exports = indexCtrl;