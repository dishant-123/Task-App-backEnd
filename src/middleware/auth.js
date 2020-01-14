const User = require('../models/user')
const jwt = require('jsonwebtoken')

const auth = async(req, res, next) =>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET) //id of parent and creation time
        const user = await User.findOne({_id : decoded._id, 'tokens.token' : token})
        if(!user){
            throw new Error()
        }
        req.user = user //attach that user to req.user for performance
        req.token = token
        next()
    }   catch(e){
        res.status(401).send({error: 'PLease Authenticate.'})
    }
}

module.exports =auth