const mongoose = require('mongoose')

const connectDB = () => { 
    return mongoose.connect('mongodb://10.11.0.21:27017')
}

module.exports = connectDB