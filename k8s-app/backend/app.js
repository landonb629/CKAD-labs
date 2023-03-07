const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config();
const dbConnection = require('./db/db')


app.use(cors());
app.use(express.json());

app.get("/api/v1/get", (req, res) => { 
    console.log('backend responding')
    res.status(200).json({msg: 'rendered from api'})
})


const start = async () => { 
    try { 
        await dbConnection();
        app.listen(3032, ()=> { 
            console.log("listening on port 3032")
        })
    } catch(error) { 
        console.log(error)
    }
}

start()