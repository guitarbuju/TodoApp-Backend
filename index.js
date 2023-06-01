const express = require('express')
const cors = require('cors') 
const dotenv = require('dotenv').config()
const mongo= require('./mongo/connection')
const app = express()
const Task=require('./mongo/schemas/taskSchema')


app.use(cors())
app.use(express.json())


app.get('/',async(req , res )=>{
   
    const AllData= await Task.find()
    res.status(200).json(AllData)
})

app.get('/:id',async(req , res )=>{
   
    const idData= await Task.findById(req.params.id)
    res.status(200).json(idData)
})




app.post('/main',async (req , res )=>{
   const body=req.body
   
   const data= {
    date:new Date(body.ProperDate),
    task:body.task,
    done:body.done

}
    console.log(data)
   const newTask= new Task(data)
   console.log(newTask)
  await newTask.save()

  res.json(newTask)
})


app.patch('/done/:id',async (req,res)=>{
   
    try {
        const { id } = req.params;
    
        // Update the key value from false to true
        const updatedDocument = await Task.findByIdAndUpdate(
          id,
          { done: true },
          { new : true }
         
        );
    
        res.status(200).json({ message: 'Key value updated successfully.',document:updatedDocument });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred.' });
      }
    })


    app.patch('/inprogress/:id',async (req,res)=>{
   
      try {
          const { id } = req.params;
      
          // Update the key value from false to true
          const updatedDocument = await Task.findByIdAndUpdate(
            id,
            { inprogress: true },
            { new : true }
           
          );
      
          res.status(200).json({ message: 'Key value updated successfully.',document:updatedDocument });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'An error occurred.' });
        }
      })
      
    app.delete('/delete/:id',async (req,res)=>{
   
      try {
          const { id } = req.params;
      
          // delete the key value 
          const updatedDocument = await Task.findByIdAndDelete(id)
      
          res.status(200).json({ message: 'Key value deleted successfully.',document:updatedDocument });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'An error occurred.' });
        }
      })
    















const PORT = process.env.PORT

app.listen(PORT, ( )=>{
console.log(`Servidor escuchando en el puerto ${PORT}`)
})