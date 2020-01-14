    const mongoose  = require('mongoose')
    const validator = require('validator')
    const bcrypt = require('bcryptjs')
    const jwt = require('jsonwebtoken')
    const Task = require('./task')
    const userSchema = new mongoose.Schema({
        name : {
            type : String,
            required : true
        },
        email  : {
            type : String,
            required : true,
            unique:true,
            trim : true,
            lowercase : true,
            validate(value){
                if ( !validator.isEmail(value)){
                    throw new Error('Email is invalid !')
                }
            }
        },
        password : {
            type : String,
            required : true,
            minlength : 7,
            trim : true,
            validate(value) {
                if(value.toLowerCase().includes('password')){
                    throw new Error('Password can\'t contain "password" ')
                }
            }
        },
        age : {
            type : Number,
            default :0 ,
            validate(value){
                if(value < 0){
                    throw new Error('Age must be a positive number')
                }
            }
        },
        tokens:[{
            token:{
                type : String,
                required : true
            }
        }],
        avatar : {
            type : Buffer
        }
    }, {
        timestamps : true
    })
    userSchema.pre('remove',  async function(next){
        const user = this
        await Task.deleteMany({owner : user._id})
        next()
    })
    //since user model doesnot has tasks so we are virtallly set things.
    userSchema.virtual('tasks',{ ///tasks is name which we use.
        ref : 'Task',
        localField : '_id', //of user.
        foreignField : 'owner'
        
    })
    //call before res.send() is used, for deleting passowrd and tokens in all request
    userSchema.methods.toJSON = function(){
        const user = this
        userObject = user.toObject() //all moongoose data ko hatane k liye, for getting raw object.

        delete userObject.password
        delete userObject.tokens
        return userObject
    }
    userSchema.methods.generateAuthToken = async function(){
        const user = this
        const token = jwt.sign({ _id : user._id.toString()}, process.env.JWT_SECRET)
        user.tokens = user.tokens.concat({token : token})
        await user.save()
        return token
    }
    // for patch operation
    userSchema.statics.findByIdAndEmail = async (email, password)=>{
        const user = await User.findOne({email : email})
        if(!user){
            throw new User('Unable To Login.')
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            throw new Error('Unable To Login')
        }

        return user
    }
    //simple functiion because arrow function don't bind this.
    //Hash the plain password before saving.
    userSchema.pre('save',async function(next) {
        const user = this
        console.log('before saving')
        if(user.isModified('password')){
            user.password = await bcrypt.hash(user.password, 8)
        }
        next()
    })
    const User =mongoose.model('User' , userSchema)

    module.exports = User