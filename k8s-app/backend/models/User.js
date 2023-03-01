const mongoose = require('mongoose')
const { Schema } = mongoose


const User = new Schema({
    name: { 
        type: String
    },
    email: { 
        type: String
    },
    address: { 
        type: String
    }
})

module.exports = mongoose.model('User', User)