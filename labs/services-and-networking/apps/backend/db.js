const mongoose = require('mongoose')

const dbConnection = async () => { 
    try { 
      return mongoose.connect(`mongodb://${process.env.DB}:27017`)
    } catch(error) { 
      console.log(error)
    }
}

module.exports =  dbConnection