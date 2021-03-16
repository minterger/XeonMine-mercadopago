const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Esta pagina no existe, fuiste redireccionado');
    res.redirect('/')
}

module.exports = helpers