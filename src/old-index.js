const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json()) 

app.listen(PORT , () =>{
    console.log('app is running on port ' + PORT)
})

app.get('/users', async(req,res) =>{
    //promises chaining .
    
    // User.find({}).then((user)=>{
    //     return res.send(user)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
    //async await.

    try{
        const user = await User.find({})
        return res.send(user)
    } catch(e){
        res.status(500).send(e)
    }
})

app.get('/users/:id', async(req,res) =>{
    const _id = req.params.id
    //
    // User.findById(_id).then((user)=>{
    //     if(!user){
    //         return res.status(404).send()
    //     }
    //     return res.send(user)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })

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

app.post('/users', async(req,res) =>{
    // const user = new User(req.body)
    // user.save().then((user)=>{
    //     return res.send(user)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })

    try{
        const newUser = await new User(req.body)
        const user = await newUser.save()
        return res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

app.patch('/users/:id',async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowsUpdates = ['name','email','password','age']
    const isValidOperaton = updates.every((update)=>allowsUpdates.includes(update))
    if(!isValidOperaton){
        return res.status(400).send({error : 'invalid operation'})
    }
    try{
        const user  =await User.findOneAndUpdate(req.body.id, req.body, {new:true, runValidators:true})

        if(!user){
            return res.status(404).send()
        }
        return res.send(user)
    }catch(e){
        res.status(404).send(e)
    }
})

app.delete('/users/:id',async(req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id,(user)=>{
            if(!user){
                return res.status(404).send()
            }
            return res.send(user)
        })  
    }catch(e){
        // console.log('Error'+e)
        return res.status(500).send('Error'+e)
    }
})

app.get('/tasks' , async(req,res) =>{
    // Task.find({})
    // .then((task)=>{
    //     return res.status(201).send(task)
    // })
    // .catch((e)=>{
    //     return res.status(500).send(e)
    // })

    try{
        const task = await Task.find({})
        return res.status(201).send(task)
    }catch(e){
        return res.status(500).send(e)
    }
})

app.get('/tasks/:id' , async(req,res) =>{
    const _id = req.params.id
    /*
      Task.findById(_id)
    .then((task)=>{
        if(!task){
                return res.status(404).send()
        }
        return res.status(201).send(task)
    })
    .catch((e)=>{
        return res.status(500).send(e)
    })
     */

    try{
        const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        return res.status(201).send(task)
    }catch(e){
        return res.status(500).send(e)
    }
})

app.post('/tasks' , async(req,res) =>{
    // const task  = new Task(req.body)
    // Task.save()
    // .then(()=>{
    //     return res.status(201).send(task)
    // })
    // .catch((e)=>{
    //     return res.status(400).send(e)
    // })

    try{
        const newTask  = await new Task(req.body)
        await newTask.save()
        return res.status(201).send(newTask)

    }catch(e){
        return res.status(400).send(e)
    }
    
})

app.delete('/tasks/:id',async(req,res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        return res.status(500).send(e)
    }
})