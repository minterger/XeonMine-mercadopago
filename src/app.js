const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const morgan = require('morgan');

// initializations
const app = express();
require('./config/passport');

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
    layoutsDir: path.join(app.get('views'), 'layouts'),
    defaultLayout: 'main',
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs'
}))
app.set('view engine', 'hbs')

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'))
app.use(methodOverride('_method'));
app.use(session({
    secret: 'Mactroll1!',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// global variable
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    next();
})

// helpers
require('./helpers/hbs');

// routes
app.use(require('./routes/index.routes'));
app.use(require('./routes/user.routes'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res) => {
    res.status(404);
    req.flash('error_msg', 'Esta pagina no existe, fuiste redireccionado');
    res.redirect('/');
});

app.use((error, req, res, next) => {
    res.status(500).send('500: Error Interno del Servidor');
});

module.exports = app;