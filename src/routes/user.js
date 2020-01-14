const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, sendCalcinationEmail} = require('../email/account')

//not in real application but for practice
router.get('/users', auth,  async(req,res) =>{
    try{
        const user = await User.find({})
        return res.send(user)
    } catch(e){
        res.status(500).send(e)
    }
})

router.get('/users/me', auth , async(req,res)=>{
    res.send(req.user)
})

router.get('/users/:id', async(req,res) =>{
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
            if(!user){
            return res.status(404).send()
        }
        return res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
}) 


router.post('/users', async (req, res) => {

    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login',async(req, res)=>{
    try{
        const user = await User.findByIdAndEmail(req.body.email, req.body.password) //function attach in user model
        const token = await user.generateAuthToken();
        res.send({user, token})
    }catch(e){
        res.status(400).send()
    }
})
router.post('/users/logout', auth, async(req ,res)=>{
    try{
            req.user.tokens = req.user.tokens.filter((singleToken)=>{
                return singleToken.token !== req.token //req.token atttack in auth model with req.
            })
            await req.user.save()
            res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async(req, res)=>{
    console.log('LogoutAll')
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/users/me', auth, async (req, res)=>{

    const updates = Object.keys(req.body)
    const allowsUpdates = ['name','email','password','age']
    const isValidOperaton = updates.every((update)=>allowsUpdates.includes(update))

    if(!isValidOperaton){
        return res.status(400).send({error : 'invalid operation'})
    }
    try{
        // const user  =await User.findOneAndUpdate(req.body.id, req.body, {new:true, runValidators:true})

         //beacuse userSchema in model is not running(because of not using save.)
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
         res.send(req.user)
    }catch(e){
        res.status(404).send(e)
    }
})
 
/** Not UseFul because any  */

// router.delete('/users/:id',async(req,res)=>{
//     try{
//           await User.findByIdAndDelete(req.params.id,(user)=>{
//             if(!user){
//                 return res.status(404).send()
//             }
//             return res.send(user)
//         })  
       

//     }catch(e){
//         return res.status(500).send('Error'+e)
//     }
// })
router.delete('/users/me', auth, async(req,res)=>{
    try{
        await req.user.remove()
        sendCalcinationEmail(req.user.email, req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(400).send()
    }
})

const upload = multer({
    // dest  : 'avatars',
     limits : {
         filesize : 1000000,
     },
     fileFilter(req, file, cb){
         if(!file.originalname.match(/\.(jpg|jpeg|:png)$/)){
             return cb(new Error('please upload an image'))
         }
         cb(undefined, true)
     }
})

router.post('/users/me/avatar', auth , upload.single('avatar'), async(req, res)=>{
    // req.user.avatar = req.file.buffer
    /**since we are using sharp */
    const buffer = await sharp(req.file.buffer).resize({width : 250, height : 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error,  req, res ,next) =>{ //catch whatever xomes from upload.single middle ware
    res.status(400).send({error : error.message})
})

router.delete('/users/me/avatar', auth, async(req,res) =>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
},(error, req, res, next) =>{
    return res.status(400).send()
})

router.get('/users/:id/avatar',async (req,res) =>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    }catch(e){
        res.status(404).send() //404  = not found
    }
})
module.exports = router
