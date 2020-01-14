    const mongoose  = require('mongoose')

    const taskSchema = new mongoose.Schema({
        description  : {
            type : String,
            required : true,
            trim : true
        },
        completed  : {
            type : Boolean,
            default : false
        },
        owner : {
            type : mongoose.Schema.Types.ObjectId,
            required: true,
            ref : 'User'//so that they can use user
        }

    },{
            timestamps:true
    })
     const task = mongoose.model('Task', taskSchema)
        module.exports = task
    
        // const firstTask = new task({
        //     description : '     Eat BreakFast    ',
        //     // completed : false
        // })
    
        // firstTask.save().then((result) =>{
        //     console.log(result)
        // }).catch( (error)=>{
        //     console.log(error)
        // })