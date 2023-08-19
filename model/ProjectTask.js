import mongoose from "mongoose";

// Schema for taks asigned to Users during a Project
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: Date,
  status: String,
  project: String,
  role:String
});

const Task  = mongoose.model('Task',taskSchema);
export default Task;