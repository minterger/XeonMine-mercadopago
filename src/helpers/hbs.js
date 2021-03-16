const { create } = require('express-handlebars');

const hbs = create({});

hbs.handlebars.registerHelper('text-status', (statusLast) => {
    switch (statusLast) {
        case 1:
            return 'text-success'
            break;
        case 2:
            return 'text-warning'
            break;
        case 3:
            return 'text-danger'
            break;
        case 0:
            return 'text-danger'
            break;
        default:
            break;
    }

})

hbs.handlebars.registerHelper('findStatus', (statusLast) => {
    if (statusLast == 3 || statusLast == 0) {
        return true
    } else {
        return false
    }
})

module.exports = hbs