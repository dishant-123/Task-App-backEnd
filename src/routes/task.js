const express =require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')
router.get('/tasks' , auth, async(req,res) =>{
    // Task.find({})
    // .then((task)=>{
    //     return res.status(201).send(task)
    // })
    // .catch((e)=>{
    //     return res.status(500).send(e)
    // })
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
        // const task = await Task.find({})
        // const tasks = await Task.find({owner : req.user._id})

        // ..new login to do things ..//
        await req.user.populate({
            path : 'tasks',
            match,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort : sort
            }
        }).execPopulate()

        return res.status(201).send(req.user.tasks)
    }catch(e){
        return res.status(500).send(e)
    }
})

router.get('/tasks/:id' , auth, async(req,res) =>{
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
        // const task = await Task.findById(_id)
        const task  = await Task.findOne({_id , owner : req.user._id})
        if(!task){
            return res.status(404).send()
        }
        return res.status(201).send(task)
    }catch(e){
        return res.status(500).send(e)
    }
})

router.post('/tasks' , auth, async(req,res) =>{
    // const task  = new Task(req.body)
    // Task.save()
    // .then(()=>{
    //     return res.status(201).send(task)
    // })
    // .catch((e)=>{
    //     return res.status(400).send(e)
    // })

    try{
        // const newTask  = await new Task(req.body)
        const newTask = new Task({
            ...req.body,
            owner : req.user._id
        })
        await newTask.save()
        return res.status(201).send(newTask)

    }catch(e){
        return res.status(400).send(e)
    }
    
})


router.patch('/tasks/:id', auth, async(req, res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send ({error : 'Invalid Updates!'})
    }
    try{
        const task =await Task.findOne({_id : req.params.id, owner : req.user._id})

        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)

    }catch(e){
        res.status(400).send() //400 = bad request.
    }
})

router.delete('/tasks/:id', auth, async(req,res)=>{
    const _id = req.params.id
    try{
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id, owner : req.user._id})
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        return res.status(500).send(e)
    }
})

module.exports = router