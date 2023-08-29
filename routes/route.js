import express from 'express';
import { Login, approveFriendRequest, create_project, send_friend_request, get_project, logout, registration, send_project_invitation, search_users } from '../controller/controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.route("/register").post(registration);
router.route("/login").post(Login);
router.route("/logout").post(logout);
router.route("/createProject").all(auth).post(create_project);
router.route("/getProject").all(auth).get(get_project);
router.route("/searchUsers").all(auth).post(search_users);
router.route("/sendFriendRequest").all(auth).post(send_friend_request);
router.route("/approveFriendRequset").all(auth).post(approveFriendRequest);
router.route("/ProjectInvitation").all(auth).post(send_project_invitation);
export default router;