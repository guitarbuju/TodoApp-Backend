const Task = require("../mongo/schemas/taskSchema");

const test = ("/", async (req, res) => {
 


  
  const Alldata = await Task.find();
  res.json(Alldata);
});

const getAllTasks = ("/:user", async (req, res) => {
  const userId = req.params.user;


  
  const Alldata = await Task.find({user:userId});
  res.json(Alldata);
});

const getTodayTasks = ("/today/:user", async (req, res) => {
  const today = new Date();
  const userId = req.params.user;
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const TodayData = await Task.find({
    date: { $gte: today, $lt: tomorrow },
    user: userId, 
  }).sort({ date: 1 });

  res.status(200).json(TodayData);
});

const getIdTask = ("/:id", async (req, res) => {
  const { userId } = req.body;
  const idData = await Task.findOne({ _id: req.params.id, user: userId });
  res.status(200).json(idData);
});

const postNewTask = ("/main/:user", async (req, res) => {
  const body = req.body;
  const userId= req.params.user
 

  const data = {
    date: new Date(body.ProperDate),
    task: body.task,
    done: body.done,
    inProgress: body.inProgress,
    category:body.category,
    user: userId, 
  };
  console.log(data);
  const newTask = new Task(data);
  console.log(newTask);
  await newTask.save();

  res.json(newTask);
});

const doneTask = ("/done/:id/:user", async (req, res) => {
  try {
    const { id , user} = req.params;
    
    // Update the key value from false to true
    const updatedDocument = await Task.findByIdAndUpdate(
      { _id: id, user: user }, // Find the task by ID and user
      { done: true, inProgress: false },
      { new: true }
    );
    res
      .status(200)
      .json({
        message: "Key value updated successfully.",
        document: updatedDocument,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
});

const progressTask = ("/inprogress/:id/:user", async (req, res) => {
  try {
    const { id , user} = req.params;
    
    // Update the key value from false to true
    const updatedDocument = await Task.findByIdAndUpdate(
      { _id: id, user: user }, // Find the task by ID and user
      { inProgress: true },
      { new: true }
    );
    

    res
      .status(200)
      .json({
        message: "Key value updated successfully.",
        document: updatedDocument,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
});

const deleteTask =  ("/delete/:id/:user",
async (req, res) => {
  try {
    const { id ,user} = req.params;
     // Assuming the authenticated user's ID is available in req.user

    // Delete the task for the current user
    const deletedTask = await Task.findOneAndDelete({ _id: id, user: user });

    res.status(200).json({
      message: "Task deleted successfully.",
      document: deletedTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
});








   

module.exports = {test,getAllTasks,getTodayTasks,getIdTask,postNewTask, doneTask,progressTask,deleteTask}