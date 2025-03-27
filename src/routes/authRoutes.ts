import { Router } from "express";
import { loginHandler, logoutHandler, registHandler, updateProfileHandler } from "../controllers/authController";
import { protect } from "../middleware/authMiddleWare";
import validatRegister from "../validators/validateRegister";
import validatLogin from "../validators/validateLogin";

const authRouter = Router();

authRouter.post("/register",validatRegister, registHandler)
authRouter.post("/login",validatLogin, loginHandler)
authRouter.post("/logout", logoutHandler)
authRouter.put("/update",protect, updateProfileHandler)

export default authRouter;