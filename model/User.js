import mongoose from "mongoose";

// User Schema 
const userSchema = new mongoose.Schema({
  username: String,
  id: String,
  password:String,
  phoneNumber:String,
  friends: [String],
  pendingRequests: [String],
  primaryLanguage:String,
  SecondaryLanguage:[String],
});

const User = mongoose.model('User',userSchema);
export default User;
