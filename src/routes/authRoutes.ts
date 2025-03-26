import { Router } from "express";
import { loginHandler, logoutHandler, registHandler, updateProfileHandler } from "../controllers/authController";
import { protect } from "../middleware/authMiddleWare";

const authRouter = Router();

authRouter.post("/register", registHandler)
authRouter.post("/login", loginHandler)
authRouter.post("/logout", logoutHandler)
authRouter.put("/update",protect, updateProfileHandler)

export default authRouter;