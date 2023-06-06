const User= require('./mongo/schemas/userSchema');
const express=require('express')
const AuthRouter=express.Router()
const dotenv= require('dotenv').config()
const secret= process.env.SECRET
const JWT= require('jsonwebtoken')
const bcrypt= require('bcryptjs')


AuthRouter.post('/register', async(req, res )=>{
const body=  req.body
console.log(body)

const email=req.body.email

if(!email){ return res.status(400).json({error:'No aparece el dato email'})}

const existingUser= await User.findOne({email:email})
if(existingUser){return res.status(400).json({error:'El usuario ya esta registrado en BD'})}
else{
    const newUser=new User({
        name:body.name,
        email:body.email,
        password:body.password
    })
    
    const savedUser= await newUser.save()
    if (savedUser){
        return res.status(200).json(
            {token:savedUser.generateJWT(),
             user:{
                name:savedUser.name,
                email:savedUser.email,
                id:savedUser.id
             }   
            })
    }else{
        return res.status(400).json({error:'Error al generar nuevo usuario'})
    }
}

})


AuthRouter.post('/login', async (req,res)=>{
    const {email, password}=req.body

    if(!email || !password){
        return res.status(400).json({error:'Falta el email o el password'})
    }
        const foundUser= await User.findOne({email:email})
        if(!foundUser){
            res.status(400).json({error:'No aparece el email del  usuario en la BD'})
        }
//         const foundUserPass= await User.findOne({password:password})
      

//         const storedHashedPassword =foundUserPass

//         // Compare the user's inputted password with the stored hashed password
//   const passwordsMatch =  bcrypt.compare(req.body.password, storedHashedPassword);
  
//   if (passwordsMatch) {
    // Passwords match, proceed with successful login
     return res.status(200).json(
        {
            token:foundUser.generateJWT(),
            user:{
            name:foundUser.name,
            email:foundUser.email,
            id:foundUser.id
         }   
        }
    )
   
  

      
       

})

const jwtMiddleware = (req, res, next) => {
    // Recogemos el header "Authorization". Sabemos que viene en formato "Bearer XXXXX...",
    // así que nos quedamos solo con el token y obviamos "Bearer "
    const authHeader = req.headers["authorization"];
  
    if (!authHeader)
      return res.status(401).json({ error: "Unauthorized MISSING HEADER" });
    const token = authHeader.split(" ")[1];
    // Si no hubiera token, respondemos con un 401
    if (!token) return res.status(401).json({ error: "Unauthorized and missing token" });
  
    let tokenPayload;
  
    try {
      // Si la función verify() funciona, devolverá el payload del token
      tokenPayload = JWT.verify(token, secret);
    } catch (error) {
      // Si falla, será porque el token es inválido, por lo que devolvemo error 401
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    // Guardamos los datos del token dentro de req.jwtPayload, para que esté accesible en los próximos objetos req
    req.payload = tokenPayload;
    next();
  };







module.exports={AuthRouter, jwtMiddleware}