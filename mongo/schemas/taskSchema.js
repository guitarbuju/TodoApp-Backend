
const {model, Schema}=require('mongoose')

const TaskSchema=new Schema ({
    date: {type:Date},
    task:{type:String},
    done:{type:Boolean}, 
    inProgress:{type:Boolean}
},{timestamps: true})

const Task=model('task',TaskSchema)

module.exports=Task