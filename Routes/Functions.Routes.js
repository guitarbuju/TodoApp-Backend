const Task = require("../mongo/schemas/taskSchema");

const getAllTasks = ("/", async (req, res) => {
  const Alldata = await Task.find();
  res.json(Alldata);
});

const getTodayTasks = ("/today", async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const TodayData = await Task.find({
    date: { $gte: today, $lt: tomorrow },
  }).sort({ date: 1 });

  res.status(200).json(TodayData);
});

const getIdTask = ("/:id", async (req, res) => {
  const idData = await Task.findById(req.params.id);
  res.status(200).json(idData);
});

const postNewTask = ("/main", async (req, res) => {
  const body = req.body;

  const data = {
    date: new Date(body.ProperDate),
    task: body.task,
    done: body.done,
    inProgress: body.inProgress,
  };
  console.log(data);
  const newTask = new Task(data);
  console.log(newTask);
  await newTask.save();

  res.json(newTask);
});

const doneTask = ("/done/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Update the key value from false to true
    const updatedDocument = await Task.findByIdAndUpdate(
      id,
      { done: true ,
      inProgress:false},
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

const progressTask = ("/inprogress/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Update the key value from false to true
    const updatedDocument = await Task.findByIdAndUpdate(
      id,
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

const deleteTask =  ("/delete/:id",
async (req, res) => {
  try {
    const { id } = req.params;

    // delete the key value
    const updatedDocument = await Task.findByIdAndDelete(id);

    res
      .status(200)
      .json({
        message: "Key value deleted successfully.",
        document: updatedDocument,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
});

module.exports = {getAllTasks,getTodayTasks,getIdTask,postNewTask, doneTask,progressTask,deleteTask}