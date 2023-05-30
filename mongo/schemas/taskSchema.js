
const {model, Schema}=require('mongoose')

const TaskSchema=new Schema ({
    date: {type:Date},
    task:{type:String},
    done:{type:Boolean}
})

const Task=model('task',TaskSchema)

module.exports=Task