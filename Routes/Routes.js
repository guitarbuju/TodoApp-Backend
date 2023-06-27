const express=require('express')
const router=express.Router()
const {jwtMiddleware}=require('../authorization')



const {test,getAllTasks,getTodayTasks,getIdTask,postNewTask, doneTask,progressTask,deleteTask}=require('./Functions.Routes')

router.get('/',getAllTasks,test)
router.get('/:user',jwtMiddleware,getAllTasks)

router.get('/today/:user',jwtMiddleware,getTodayTasks)


router.get('/:id',jwtMiddleware,getIdTask)

router.post('/main/:user',jwtMiddleware,postNewTask)


router.patch('/done/:id/:user', doneTask);

router.patch('/inProgress/:id/:user', progressTask);

router.delete('/delete/:id/:user', jwtMiddleware, deleteTask);


module.exports=router