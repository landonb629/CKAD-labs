const express = require('express');
const app = express();
const cors = require('cors')
const connectDB = require('./db/db')
const userRoutes = require('./routes/user')

app.use(cors())
app.use(express.json())

app.use('/api/v1/user', userRoutes)

const start = async () => { 
    try { 
        await connectDB()
        app.listen(3030,()=> {
            console.log('application listening on port 3030')
        })
    } catch(error) { 
        
    }
}

start()







