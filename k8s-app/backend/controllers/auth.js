const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')


const register = async (req, res) => { 
    try { 
        console.log('hitting the register route')
        const {name,email, password} = req.body;
        const oldUser = await User.findOne({email})
        if (oldUser) { 
            console.log(oldUser)
            return res.status(200).send('please login, user credentials already found')
        } else {
        // hashing is handled by a presave hook in mongoose
        const user = await User.create({...req.body});
        const token = await user.createJWT()
        console.log(user, token);

        res.status(200).json({
            user_id: user._id,
            token: token
        })
    }

    } catch(error) { 
        console.log('error encountered')
        res.status(200).send(error)
    }
}

const getUser = async (req, res) => { 
    try { 
        const user = await User.find({})
        console.log('hitting the users route')
        res.status(200).json({msg: 'getting the users'})
    } catch(error) { 

    }
}

const login = async (req, res) => { 
    try { 
    // what do we want to accomplish with a login?
    // user submits username and password => lookup the email and compare the password => send back a token 
    const { email, password } = req.body;
    console.log(email, password)
    if (!email || !password ) {
        return res.status(404).send('please provide username and passwor')
    }
    const user = await User.findOne({email});
    if (!user) { 
        return res.status(404).send('please create an account')
    }
    const isPasswordCorrect = await user.comparePasswords(password);
    if (isPasswordCorrect) { 
        const token = await user.createJWT()
        res.status(200).send({
            user_id: user._id,
            token: token
        })
    }
     //const token = user.createJWT();
     //res.status(200).json({
       //  user: user._id,
         //token: token
     // }

    } catch(error) { 
        console.log(error)
    } 
}



module.exports = { 
    register,
    getUser,
    login
}


