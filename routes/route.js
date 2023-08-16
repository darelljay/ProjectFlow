import express from 'express';
import { Login, logout, registration } from '../controller/controller.js';

const router = express.Router();

router.route("/register").post(registration);
router.route("/login").post(Login);
router.route("/logout").post(logout);
export default router;