import express from 'express';
import { Login, create_project, friend_request, get_project, logout, registration } from '../controller/controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.route("/register").post(registration);
router.route("/login").post(Login);
router.route("/logout").post(logout);
router.route("/createProject").all(auth).post(create_project);
router.route("/getProject").all(auth).get(get_project);
router.route("/sendFriendRequest").all(auth).post(friend_request);
export default router;