import Team from "../models/Team.js";
import User from "../models/User.js";
import {
  ConflictError,
  NotFoundError,
  AuthorizationError,
} from "../utils/errorResponse.js";
import logger from "../utils/logger.js";

const roleRank = {
  viewer: 1,
  member: 2,
  manager: 3,
  admin: 4,
};

const assertCanManageTeam = (team, userId) => {
  const role = team.getMemberRole(userId);
  if (!role || roleRank[role] < roleRank.admin) {
    throw new AuthorizationError("Only team admins can manage members");
  }
};

const assertCanViewTeam = (team, userId) => {
  const role = team.getMemberRole(userId);
  if (!role) {
    throw new AuthorizationError("You do not have access to this team");
  }
};

export const createTeam = async ({ userId, name, description }) => {
  const team = new Team({
    name,
    description,
    createdBy: userId,
    members: [
      {
        userId,
        role: "admin",
        joinedAt: new Date(),
      },
    ],
  });

  await team.save();
  logger.info(`Team created: ${team.name} by user ${userId}`);
  return team;
};

export const listTeams = async (userId) => {
  return Team.find({ "members.userId": userId, isArchived: false }).sort({
    createdAt: -1,
  });
};

export const getTeamById = async (teamId, userId) => {
  const team = await Team.findById(teamId);
  if (!team || team.isArchived) {
    throw new NotFoundError("Team");
  }
  assertCanViewTeam(team, userId);
  return team;
};

export const updateTeam = async ({ teamId, userId, name, description }) => {
  const team = await Team.findById(teamId);
  if (!team || team.isArchived) {
    throw new NotFoundError("Team");
  }
  assertCanManageTeam(team, userId);
  if (name !== undefined) team.name = name;
  if (description !== undefined) team.description = description;
  await team.save();
  logger.info(`Team updated: ${teamId} by user ${userId}`);
  return team;
};

export const deleteTeam = async ({ teamId, userId }) => {
  const team = await Team.findById(teamId);
  if (!team || team.isArchived) {
    throw new NotFoundError("Team");
  }
  assertCanManageTeam(team, userId);
  team.isArchived = true;
  await team.save();
  logger.info(`Team archived: ${teamId} by user ${userId}`);
  return team;
};

export const addTeamMember = async ({ teamId, userId, memberEmail, role }) => {
  const team = await Team.findById(teamId);
  if (!team || team.isArchived) {
    throw new NotFoundError("Team");
  }
  assertCanManageTeam(team, userId);

  const memberUser = await User.findOne({ email: memberEmail.toLowerCase() });
  if (!memberUser) {
    throw new NotFoundError("User");
  }

  if (team.isMember(memberUser._id)) {
    throw new ConflictError("User is already a team member");
  }

  team.members.push({ userId: memberUser._id, role, joinedAt: new Date() });
  await team.save();
  logger.info(
    `Member ${memberUser.email} added to team ${teamId} by ${userId}`,
  );
  return team;
};

export const updateMemberRole = async ({ teamId, userId, memberId, role }) => {
  const team = await Team.findById(teamId);
  if (!team || team.isArchived) {
    throw new NotFoundError("Team");
  }
  assertCanManageTeam(team, userId);

  const member = team.members.find(
    (entry) => entry.userId.toString() === memberId,
  );
  if (!member) {
    throw new NotFoundError("Team member");
  }

  member.role = role;
  await team.save();
  logger.info(`Member role updated in team ${teamId} by ${userId}`);
  return team;
};

export const removeTeamMember = async ({ teamId, userId, memberId }) => {
  const team = await Team.findById(teamId);
  if (!team || team.isArchived) {
    throw new NotFoundError("Team");
  }
  assertCanManageTeam(team, userId);

  const beforeCount = team.members.length;
  team.members = team.members.filter(
    (entry) => entry.userId.toString() !== memberId,
  );
  if (team.members.length === beforeCount) {
    throw new NotFoundError("Team member");
  }

  if (team.members.length === 0) {
    throw new ConflictError("Team must have at least one member");
  }

  await team.save();
  logger.info(`Member removed from team ${teamId} by ${userId}`);
  return team;
};

export const getTeamMembership = async (teamId, userId) => {
  const team = await Team.findById(teamId);
  if (!team || team.isArchived) {
    throw new NotFoundError("Team");
  }
  const role = team.getMemberRole(userId);
  if (!role) {
    throw new AuthorizationError("You do not have access to this team");
  }
  return { team, role };
};

export default {
  createTeam,
  listTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  addTeamMember,
  updateMemberRole,
  removeTeamMember,
  getTeamMembership,
};
