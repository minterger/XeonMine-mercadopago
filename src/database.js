const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(db => {
        console.log('database is connected');
    })
    .catch(err => {
        console.error(err)
    })

module.exports = mongoose;