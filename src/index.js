const express = require('express')
require('./db/mongoose')

const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')

const bodyParser = require('body-parser')
const app = express()
const PORT = process.env.PORT

app.use(bodyParser.json());// app.use(express.json()) 
app.use(userRouter)
app.use(taskRouter)

app.listen(PORT , () =>{
    console.log('app is running on port ' + PORT)
})
// app.use((req, res, next)=>{
//     if(req.method == 'GET'){
//         res.send('Get method are disabled')
//     }
//     else{
//         next()
//     }
// })
// app.use((req,res,next) =>{
//     res.status(503).send("Site is Under Maintainance.")
// })


/**How to use bcrypyjs */

// const bcrypt = require('bcryptjs')

// const useBcryptjs =async ()=>{
//     const password = 'dishant!123'
//     const hashPassword = await bcrypt.hash(password,8)
//     console.log(password)
//     console.log(hashPassword)

//     const isMatch = await bcrypt.compare('dishant!123',hashPassword)
//     console.log(isMatch)
// }

//.. useBcryptjs...//

// const jwt = require('jsonwebtoken')

// const myFunction = ()=>{
//     const token = jwt.sign({ _id:'dishant1234' }, 'thisismycourse', {expiresIn : '7days'})
//     console.log(token) 
//     const data =jwt.verify(token,'thisismycourse')
//     console.log(data)
// }
// myFunction()

///.... Important Knowlwdge.. //

// const pet ={
//     name : 'Gane'
// }
// //add functionility before stringify
// pet.toJSON = function(){
//     console.log(this)
//     this.name = 'Gane Cal'
//     return this
// }
// console.log(JSON.stringify(pet))

// const Task =  require('./models/task')
// const User = require('./models/user')

// const main = async()=>{
// //     const task  =await Task.findById('5e1c13b5b694ab85b8ac289a');
// //     console.log(task.owner)
// //     // const user= await User.findById(task.owner)
// //     // console.log(user)

// //     /**...iski Jagah.. */
// //    await  task.populate('owner').execPopulate()
// //     console.log(task.owner)

//         const user  = await User.findById('5e1c13a5b694ab85b8ac2898')
//         await  user.populate('tasks').execPopulate()
//         console.log(user.tasks)
// }   
// main() 


// .. using multer (for file upload)..//

// const multer = require('multer')
// const upload = multer({
//     dest : 'images ',
//     limits : {
//         fileSize : 1000000 //1,000000 = 1mb
//     },
//     fileFilter(req, file, cb) {
//         if(!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error('Please upload a Word Document'))
//         }
        
//         cb(undefined, true) //for acepting files.
//     }
// }, (error, req, res, next) =>{
//     return res.status(400).send({error : error.message})
// })
// const  avatar = multer({
//     dest : 'avatar'
// })
// app.post('/upload', upload.single('upload'), (req, res)=>{  //'update' is name of file to be posted.
//     res.send()
// })
// app.post('/users/avatar', avatar.single('avatar'), (req, res) =>{
//     res.send()
// })