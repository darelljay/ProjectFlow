import mongoose from "mongoose";

// User Schema 
const userSchema = new mongoose.Schema({
  username: String,
  id: String,
  password:String,
  phoneNumber:String,
  friends: [String],
  receivedFriendRequest:[String],
  sentFriendRequests: [String],
  sentProjectInvites:[String],
  receivedProjectInvites:[
    {
      title: String,
      owner: String,
      description: String,
    }],
  sentProjectJoinRequests:[String],
  receivedProjectJoinRequests:[String],
  requestResultMessege:[],
  primaryLanguage:String,
  SecondaryLanguage:[String],
});

const User = mongoose.model('User',userSchema);
export default User;
