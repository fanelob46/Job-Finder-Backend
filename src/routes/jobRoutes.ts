import { Router } from "express";
import { authorizeRoles, protect } from "../middleware/authMiddleWare";
import { addJobHandler, deleteJob, getAllJobs, getJob, updateJob } from "../controllers/jobController";

import validateJob from "../validators/validateJob";

const jobRouter = Router();

jobRouter.post("/",protect,authorizeRoles("admin"), addJobHandler)
jobRouter.get("/:id",protect ,authorizeRoles("admin"),getJob)
jobRouter.get("/", protect, authorizeRoles("admin", "user"), getAllJobs);
jobRouter.put(
  "/:id",
  protect,
  validateJob,
  authorizeRoles("admin"),
  updateJob
);
jobRouter.delete("/:id", protect, authorizeRoles("admin"), deleteJob);

export default jobRouter;