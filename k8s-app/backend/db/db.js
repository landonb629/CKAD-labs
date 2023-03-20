const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();
const config = require('config')
const username = config.get('db.username')
const password = config.get('db.password')
const url = config.get('db.url')

const dbConnection = () => { 
    try {  
        return mongoose.connect("mongodb://db.default.svc.cluster.local:27017", { //url,{
           // auth: { 
           //     username: username,
           //     password: password
           // },
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: false
        })

    } catch(error) { 
        console.log(error)
    }
}

module.exports = dbConnection