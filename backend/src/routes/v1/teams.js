import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { requireTeamRole } from "../../middleware/teamAccess.js";
import {
  createTeam,
  listTeams,
  getTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  updateMemberRole,
  removeTeamMember,
} from "../../controllers/teamController.js";

const router = express.Router();

router.use(authenticate);

router.get("/", listTeams);
router.post("/", createTeam);
router.get("/:teamId", getTeam);
router.put("/:teamId", requireTeamRole("admin"), updateTeam);
router.delete("/:teamId", requireTeamRole("admin"), deleteTeam);
router.post("/:teamId/members", requireTeamRole("admin"), addTeamMember);
router.patch(
  "/:teamId/members/:memberId",
  requireTeamRole("admin"),
  updateMemberRole,
);
router.delete(
  "/:teamId/members/:memberId",
  requireTeamRole("admin"),
  removeTeamMember,
);

export default router;
