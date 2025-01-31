import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { verifyJWT } from './../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser)

// Secured routes
userRouter.post('/logout', verifyJWT, logoutUser)

export default userRouter;
