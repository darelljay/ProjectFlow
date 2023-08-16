import User from "../model/User.js";
import Project from "../model/Project.js";
import Task from "../model/ProjectTask.js";
import bcrypt from "bcrypt";


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
        return res.status(400).json({messege:"An account with this id or phone number already exists"});
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
  
    // Store user session
    req.session.user = user;
    req.session.isLoggedIn = true;
      res.status(201).json({messege:"Member registration completed successfully"});
    } catch (error) {
      console.error(error);
      res.status(500).json({messege:"An error occurred while attempting to register."});
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
        return res.status(401).json({messege:`No account found with the Id of ${id}`});
      }
    
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        // Errror messege when the password is wrong
        return res.status(401).json({messege:"Wrong Password please try again"});
      }
  
    // Store user session
    req.session.user = user;
    req.session.isLoggedIn = true;
    
    // sending a success messege
    res.status(200).json({messege:"Successfully Logged in"});
    } catch (error) {
      console.error(error);
                  // sending an error messege if with the status code of 500 if an error occurres
      res.status(500).json({messege:"An error occurred while processing your request"});
    }
  };
// logout method
  export const logout = async(req,res) =>{
    // checking if User has Registerd or Loged in 
    if (req.session && req.session.isLoggedIn) {
        // removing user data if true 
        req.session.destroy((err) => {
          if (err) {
            console.error(err);
            // sending an error messege if with the status code of 500 if an error occurres
            res.status(500).json({messege:"An error occurred during logout"});
          } else {
            // sending a succsess messege with the status of 204 when succeeded
            res.status(204).json({messege:"Logout succeeded"});
          }
        });
      } else {
            // sending an error messege if with the status code of 500 if an error occurres
            res.status(500).json({messege:"Session not found"});
      }
  }

  // Project Creating method
  
