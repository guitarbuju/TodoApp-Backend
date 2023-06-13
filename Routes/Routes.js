const express=require('express')
const router=express.Router()
const {jwtMiddleware}=require('../authorization')



const {getAllTasks,getTodayTasks,getIdTask,postNewTask, doneTask,progressTask,deleteTask}=require('./Functions.Routes')

router.get('/',jwtMiddleware,getAllTasks)

router.get('/today',jwtMiddleware,getTodayTasks)


router.get('/:id',jwtMiddleware,getIdTask)

router.post('/main',jwtMiddleware,postNewTask)


router.patch('/done/:id', doneTask);

router.patch('/inProgress/:id', progressTask);

router.delete('/delete/:id', jwtMiddleware, deleteTask);


module.exports=router