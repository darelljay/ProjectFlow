import  express  from "express";
import { auth } from "../middleware/auth.js";

const authRoute = express.Router();

authRoute.route("/auth").post(auth);
export default authRoute