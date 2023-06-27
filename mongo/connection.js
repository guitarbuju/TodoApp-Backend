const dotenv = require('dotenv').config()
const mongoose= require('mongoose')




mongoose.connect(process.env.MONGO_URL)

const mongo=mongoose.connection

mongo.on('error',(error)=>{console.log(error)})
mongo.once('open',()=>{
    console.log('conectado a la base de datos')
})

module.exports=mongo