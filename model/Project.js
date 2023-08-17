import mongoose from "mongoose";

// Schema for User created Projects
const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    deadline: Date,
    public:Boolean,
    team:Boolean,
    members:[String],
    owner: String
});

const Project = mongoose.model('Project',ProjectSchema);
export default Project;