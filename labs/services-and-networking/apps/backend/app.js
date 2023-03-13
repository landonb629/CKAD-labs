const express = require('express')
const app = express()
const dbConnection = require('./db')





const start = async () => { 
    try { 
        console.log(process.env.DB)
        await dbConnection()
        app.listen(3000, ()=> {
            console.log('listening on 3000')
        })
    } catch (error) { 

    }
}

start()