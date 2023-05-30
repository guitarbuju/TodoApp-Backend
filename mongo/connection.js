
const mongoose= require('mongoose')

mongoose.connect('mongodb://gerardo:2999@localhost:27022/TodoApp?authSource=admin')

const mongo=mongoose.connection

mongo.on('error',(error)=>{console.log(error)})
mongo.once('open',()=>{
    console.log('conectado a la base de datos')
})

module.exports=mongo