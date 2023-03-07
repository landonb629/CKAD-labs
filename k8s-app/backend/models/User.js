const mongoose = require('mongoose');
const {Schema} = mongoose
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const User = new Schema({
    name: { 
        type: String,
        required: [true, 'please enter a name']
    },
    email: { 
        type: String,
        required: [true, 'please enter an email address']
    },
    password: { 
        type: String,
        required: [true, 'please enter a password']
    }
}) 



// Has access to the document, needs to use this. to access the specifics
User.pre('save', async function(next) { 
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    console.log('password hashed')
    next()
})

User.methods.createJWT = async function() { 
    return jwt.sign({user_id: this._id}, 'jwtsecrettoken',{expiresIn: '2d'})
}

User.methods.comparePasswords = async function(givenPassword) { 
    const isMatch = await bcrypt.compare(givenPassword, this.password);
    console.log(isMatch);
    return isMatch
}


module.exports = mongoose.model('User', User)