const {Schema,model}=require('mongoose')
const bcrypt=require('bcryptjs')
const dotenv= require('dotenv').config()
const secret= process.env.SECRET
const JWT= require('jsonwebtoken')


const userSchema= new Schema(
    {
        name:{type:String},
        email:{type:String},
        password:{type:String}
     }
     )

     //Encriptacion del password
userSchema.pre('save', async function(next){
    try{
        const salt =await bcrypt.genSalt(10)
        const hashed= await bcrypt.hash(this.password,salt)
        this.password=hashed
        console.log(hashed)
        next()

    }
    catch (error){
next(error)
    }


})

userSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.password)
   
}
//Autenticacion con JWT

userSchema.methods.generateJWT= function (){

    const today= new Date()
    const expirationDate= new Date()
    expirationDate.setDate(today.getDate()+60)

    let payload={
       name: this.name,
       email:this.email,
       password:this.password
    }
return JWT.sign(payload,secret,{expiresIn: parseInt(expirationDate.getTime()/1000, 10)})

}



  const User=model ('User',userSchema  )  

  module.exports=User