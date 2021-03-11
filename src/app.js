const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const { parseWithoutProcessing } = require('handlebars');

const app = express();

app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.engine('hbs', exphbs({
    layoutsDir: path.join(app.get('views'), 'layouts'),
    defaultLayout: 'main',
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs'
}))
app.set('view engine', 'hbs')

app.use(require('./routes/index.js'));

app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;