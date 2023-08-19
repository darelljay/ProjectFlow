import User from "../model/User.js";
import Project from "../model/Project.js";
import Task from "../model/ProjectTask.js";
import bcrypt from "bcrypt";
import { auth } from "../middleware/auth.js";

// Registration Method
export const registration = async (req, res) => {
  try {
    const {
      username,
      id,
      password,
      phoneNumber,
      primaryLanguage,
      SecondaryLanguage,
    } = req.body;

    // Check if user id or phone number already exists
    const userIdExists = await User.exists({ id });
    const userPhoneNumberExists = await User.exists({ phoneNumber });
    if (userIdExists || userPhoneNumberExists) {
      return res
        .status(400)
        .json({
          messege: "An account with this id or phone number already exists",
        });
    }

    // Encrypt the password
    const encryptedPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const newUser = await User.create({
      username,
      id,
      password: encryptedPassword,
      phoneNumber,
      primaryLanguage,
      SecondaryLanguage,
    });

    res
      .status(201)
      .json({ messege: "Member registration completed successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ messege: "An error occurred while attempting to register." });
  }
};

// User Login Method
export const Login = async (req, res) => {
  const { id, password } = req.body;

  try {
    // find a User with id
    const user = await User.findOne({ id });

    if (!user) {
      // Error messege when User does not exist
      return res
        .status(401)
        .json({ messege: `No account found with the Id of ${id}` });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      // Errror messege when the password is wrong
      return res
        .status(401)
        .json({ messege: "Wrong Password please try again" });
    }

    // Store user session
    req.session.user = user;
    req.session.isLoggedIn = true;

    // sending a success messege
    res.status(200).json({ messege: "Successfully Logged in" });
  } catch (error) {
    console.error(error);
    // sending an error messege if with the status code of 500 if an error occurres
    res
      .status(500)
      .json({ messege: "An error occurred while processing your request" });
  }
};
// logout method
export const logout = async (req, res) => {
  // checking if User has Registerd or Loged in
  if (req.session && req.session.isLoggedIn) {
    // removing user data if true
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        // sending an error messege if with the status code of 500 if an error occurres
        res.status(500).json({ messege: "An error occurred during logout" });
      } else {
        // sending a succsess messege with the status of 204 when succeeded
        res.status(204).json({ messege: "Logout succeeded" });
      }
    });
  } else {
    // sending an error messege if with the status code of 500 if an error occurres
    res.status(500).json({ messege: "Session not found" });
  }
};

// Friend Request method
export const send_friend_request = async (req, res) => {
  try {
    const { recipient } = req.body;
    const sender = await User.findOne({ id: req.session.user.id });
    const recipientUser = await User.findOne({ id: recipient });

    if (!sender) {
      return res.status(400).json({ message: 'Sender user not found' });
    }

    if (!recipientUser) {
      return res.status(400).json({ message: 'Recipient user not found' });
    }
  console.log(sender)
    const alreadySentRequest = sender.sentFriendRequests.includes(recipient);
    const alreadyFriends = sender.friends.includes(recipient);

    if (!alreadySentRequest && !alreadyFriends) {
      // Update sender's pendingRequests
      await sender.updateOne(
        { id: req.session.user.id },
        { $addToSet: {sentFriendRequests:recipient} }
      );

      // Update recipient's friendRequests
      await recipientUser.updateOne(
        { id: recipient },
        { $addToSet: {receivedFriendRequest: req.session.user.id } }
      );

      res.status(200).json({ message: 'Friend Request Sent' });
    } else if (alreadySentRequest) {
      res.status(400).json({ message: 'Request Already Sent' });
    } else if (alreadyFriends) {
      res.status(400).json({ message: 'Already Friends' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ messege: 'An error occurred' });
  }
};

// project_invitation method 
export const send_project_invitation = async(req,res) =>{
    const {ProjectName,owner,recipient} = req.body;
try{
  await User.updateMany(
     {id:recipient},
     {$addToSet:{pendingRequests:{ProjectInvitation:`${owner}님 께서 ${ProjectName} 프로젝트에 초대하셧습니다. 요청을 수락하시겠습니까?`}}}
   );
   res.status(200).json({messege:"invitation Sent"});
}catch(error){
  res.status(500).json({messege:"An Error occurred while sending the invitation"});
}
}


// approve friend request
export const approveFriendRequest = async (req, res) => { 
  try {
    const { recipient, approve, sender } = req.body;

    if (approve === "true") {
      // Update recipient's friends and pending requests
      await User.updateMany(
        { id: recipient },
        {
          $addToSet: { friends: sender },
          $pull: { receivedFriendRequest: sender }
        }
      );

      // Update sender's pending requests and friends
      await User.updateMany(
        { id: sender },
        {
          $pull: { sentFriendRequests: recipient },
          $addToSet: { friends: recipient },
          $set: { requestResultMessage: [`${recipient}님 께서 친구요청을 수락하셨습니다.`] }
        }
      );

      res.status(200).json("Added to friend");
    } else {
      // Update recipient's friend requests
      await User.updateMany(
        { id: recipient },
        {
          $pull: { receivedFriendRequest: sender }
        }
      );

      // Update sender's pending requests and request result message
      await User.updateMany(
        { id: sender },
        {
          $pull: { sentFriendRequests: recipient },
          $addToSet: { requestResultMessage: [`${recipient}님 께서 친구요청을 거절하셨습니다.`] }
        }
      );

      res.status(200).json("Friend request declined");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while accepting friend request" });
  }
};

// Project Creating method
export const create_project = async (req, res) => {
  const { title, description, deadline, Public, team } = req.body;
  try {
    const newProject = await Project.create({
      title: title,
      description: description,
      deadline: deadline,
      public: Public,
      team: team,
      owner: req.session.user.id,
    });
    res
      .status(201)
      .json({ messege: "Project Successfully Created", project: newProject });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ messege: "An error occurred while processing your request" });
  }
};

// Send Project
export const get_project = async (req, res) => {
  try {
    const ClientProject = await Project.find({ owner: req.session.user.id });
    console.log(ClientProject.length);
    ClientProject.length === 1 ? res.status(200).json(ClientProject): res.status(400).json({ messege: "No Projects Created with this account" });


  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ messege: "An error occurred while processing your request" });
  }
};
