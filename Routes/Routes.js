const express=require('express')
const router=express.Router()
const {jwtMiddleware}=require('../authorization')



const {getAllTasks,getTodayTasks,getIdTask,postNewTask, doneTask,progressTask,deleteTask}=require('./Functions.Routes')

router.get('/',getAllTasks)

router.get('/today',getTodayTasks)


router.get('/:id',getIdTask)

router.post('/main',postNewTask)


router.patch('/done/:id',doneTask)

router.patch('/inProgress/:id',progressTask)

router.delete('/delete/:id', deleteTask);


module.exports=router