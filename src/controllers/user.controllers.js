const userCtrl = {};

const User = require('../models/User');
const LastDonation = require('../models/LastDonation')
const passport = require('passport')
const md5 = require('md5')

userCtrl.loginForm = (req, res) => {
    res.render('user/login')
}

userCtrl.loginUser = passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/',
    failureFlash: true
});

userCtrl.registerForm = (req, res) => {
    res.render('user/register');
}

userCtrl.registerUser = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    const errors = [];
    if (password.length <= 7) {
        errors.push('La Contraseña debe ser mayor a 7 digitos');
    }
    if (password !== confirmPassword) {
        errors.push('Las Contraseñas no coinciden');
    }
    if (errors.length <=0) {
        const newUser = new User({
            name,
            email,
            password
        })
        newUser.password = await newUser.encryptPassword(password);
        newUser.gravatar = md5(email);
        try {
            await newUser.save();
            req.flash('success_msg', 'Te has registrado correctamente');
            res.redirect('/login');
        } catch (error) {
            errors.push('El Email o el Nickname que estas usando ya se encuentra registrado');
            res.render('user/register', {errors})
        }
    } else {
        res.render('user/register', {errors});
    }
}

userCtrl.profile = async (req, res) => {
    try {
        const lastdonation = await LastDonation.find({ userId: req.params.id }).sort({createdAt: -1}).lean();
        const donator = await User.findById(req.params.id).lean();
        if (donator) {
            res.render('user/profile', { donator, lastdonation});
        } else {
            res.status(401);
            req.flash('error_msg', 'Esta pagina no existe, fuiste redireccionado');
            res.redirect('/')
        }
    } catch (error) {
        res.status(404);
        req.flash('error_msg', 'Esta pagina no existe, fuiste redireccionado');
        res.redirect('/')
    }
}

userCtrl.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'Cerraste sesion correctamente');
    res.redirect('/')
}

module.exports = userCtrl;