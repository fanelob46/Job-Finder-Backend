import { Router } from "express";
import { getUser, getAllUser, updateUser } from "../controllers/userController";
import { protect, authorizeRoles } from "../middleware/authMiddleWare";

const userRouter = Router();

userRouter.get("/:id", protect, authorizeRoles("admin"), getUser);
userRouter.get("/", protect, authorizeRoles("admin"), getAllUser);
userRouter.put("/update", protect, authorizeRoles("user", "admin"), updateUser);

;

export default userRouter;
