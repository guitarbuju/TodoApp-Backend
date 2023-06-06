
const {model, Schema}=require('mongoose')

const TaskSchema=new Schema ({
    date: {type:Date},
    task:{type:String},
    done:{type:Boolean}, 
    inProgress:{type:Boolean},
    category: {
        type: String,
        enum: ["personal", "work", "others"],
      },
    user: { type: Schema.Types.ObjectId, ref: "User" },    
},{timestamps: true})

const Task=model('task',TaskSchema)

module.exports=Task