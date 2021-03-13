const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:Mactroll1!@cluster0.9toto.mongodb.net/test', {
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