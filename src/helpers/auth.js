const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(403);
        req.flash('error_msg', 'Esta pagina no existe, fuiste redireccionado');
        res.redirect('/');
    }
}

helpers.isAuthenticatedFalse = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    } else {
        res.status(403);
        req.flash('error_msg', 'No Puedes Registrarte o Iniciar Sesion con una Sesion ya Iniciada');
        res.redirect('/');
    }
}

module.exports = helpers;