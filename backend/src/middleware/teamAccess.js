import Team from "../models/Team.js";
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from "../utils/errorResponse.js";
import logger from "../utils/logger.js";

const roleRank = {
  viewer: 1,
  member: 2,
  manager: 3,
  admin: 4,
};

export const requireTeamRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.userId) {
        throw new AuthenticationError("User not authenticated");
      }

      const teamId = req.params.teamId || req.params.id;
      if (!teamId) {
        throw new NotFoundError("Team");
      }

      const team = await Team.findById(teamId);
      if (!team || team.isArchived) {
        throw new NotFoundError("Team");
      }

      const membership = team.members.find(
        (member) => member.userId.toString() === req.user.userId,
      );

      if (!membership) {
        throw new AuthorizationError("You do not have access to this team");
      }

      if (
        allowedRoles.length > 0 &&
        !allowedRoles.some(
          (role) => roleRank[membership.role] >= roleRank[role],
        )
      ) {
        throw new AuthorizationError("Insufficient team role");
      }

      req.team = team;
      req.teamMembership = membership;
      next();
    } catch (error) {
      logger.error("Team access error:", error);
      res.status(error.statusCode || 403).json({
        success: false,
        message: error.message,
        code: error.code || "AUTHORIZATION_ERROR",
      });
    }
  };
};

export default {
  requireTeamRole,
};
