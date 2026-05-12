import {
  createTeam as createTeamService,
  listTeams as listTeamsService,
  getTeamById as getTeamByIdService,
  updateTeam as updateTeamService,
  deleteTeam as deleteTeamService,
  addTeamMember as addTeamMemberService,
  updateMemberRole as updateMemberRoleService,
  removeTeamMember as removeTeamMemberService,
} from "../services/teamService.js";
import {
  validateCreateTeam,
  validateUpdateTeam,
  validateMemberAction,
  validateRoleUpdate,
} from "../validators/teamValidator.js";
import { errorResponse } from "../utils/errorResponse.js";
import logger from "../utils/logger.js";

export const createTeam = async (req, res) => {
  try {
    const { name, description } = validateCreateTeam(req.body);
    const team = await createTeamService({
      userId: req.user.userId,
      name,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: { team },
    });
  } catch (error) {
    logger.error("Create team error:", error);
    res.status(error.statusCode || 500).json(errorResponse(error));
  }
};

export const listTeams = async (req, res) => {
  try {
    const teams = await listTeamsService(req.user.userId);
    res.status(200).json({
      success: true,
      message: "Teams retrieved successfully",
      data: { teams },
    });
  } catch (error) {
    logger.error("List teams error:", error);
    res.status(error.statusCode || 500).json(errorResponse(error));
  }
};

export const getTeam = async (req, res) => {
  try {
    const team = await getTeamByIdService(req.params.teamId, req.user.userId);
    res.status(200).json({
      success: true,
      message: "Team retrieved successfully",
      data: { team },
    });
  } catch (error) {
    logger.error("Get team error:", error);
    res.status(error.statusCode || 500).json(errorResponse(error));
  }
};

export const updateTeam = async (req, res) => {
  try {
    const { name, description } = validateUpdateTeam(req.body);
    const team = await updateTeamService({
      teamId: req.params.teamId,
      userId: req.user.userId,
      name,
      description,
    });

    res.status(200).json({
      success: true,
      message: "Team updated successfully",
      data: { team },
    });
  } catch (error) {
    logger.error("Update team error:", error);
    res.status(error.statusCode || 500).json(errorResponse(error));
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const team = await deleteTeamService({
      teamId: req.params.teamId,
      userId: req.user.userId,
    });

    res.status(200).json({
      success: true,
      message: "Team archived successfully",
      data: { team },
    });
  } catch (error) {
    logger.error("Delete team error:", error);
    res.status(error.statusCode || 500).json(errorResponse(error));
  }
};

export const addTeamMember = async (req, res) => {
  try {
    const { memberEmail, role } = validateMemberAction(req.body);
    const team = await addTeamMemberService({
      teamId: req.params.teamId,
      userId: req.user.userId,
      memberEmail,
      role,
    });

    res.status(200).json({
      success: true,
      message: "Team member added successfully",
      data: { team },
    });
  } catch (error) {
    logger.error("Add team member error:", error);
    res.status(error.statusCode || 500).json(errorResponse(error));
  }
};

export const updateMemberRole = async (req, res) => {
  try {
    const { role } = validateRoleUpdate(req.body);
    const team = await updateMemberRoleService({
      teamId: req.params.teamId,
      userId: req.user.userId,
      memberId: req.params.memberId,
      role,
    });

    res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      data: { team },
    });
  } catch (error) {
    logger.error("Update member role error:", error);
    res.status(error.statusCode || 500).json(errorResponse(error));
  }
};

export const removeTeamMember = async (req, res) => {
  try {
    const team = await removeTeamMemberService({
      teamId: req.params.teamId,
      userId: req.user.userId,
      memberId: req.params.memberId,
    });

    res.status(200).json({
      success: true,
      message: "Team member removed successfully",
      data: { team },
    });
  } catch (error) {
    logger.error("Remove team member error:", error);
    res.status(error.statusCode || 500).json(errorResponse(error));
  }
};

export default {
  createTeam,
  listTeams,
  getTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  updateMemberRole,
  removeTeamMember,
};
