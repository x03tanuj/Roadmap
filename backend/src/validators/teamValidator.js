import Joi from "joi";
import { ValidationError } from "../utils/errorResponse.js";

const createTeamSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().max(500).allow("", null).default(""),
});

const updateTeamSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  description: Joi.string().trim().max(500).allow("", null).optional(),
});

const memberActionSchema = Joi.object({
  memberEmail: Joi.string().email().required(),
  role: Joi.string()
    .valid("admin", "manager", "member", "viewer")
    .default("member"),
});

const roleUpdateSchema = Joi.object({
  role: Joi.string().valid("admin", "manager", "member", "viewer").required(),
});

const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const details = error.details.map((item) => ({
      field: item.path[0],
      message: item.message,
    }));
    throw new ValidationError("Validation failed", details);
  }
  return value;
};

export const validateCreateTeam = (data) => validate(createTeamSchema, data);
export const validateUpdateTeam = (data) => validate(updateTeamSchema, data);
export const validateMemberAction = (data) =>
  validate(memberActionSchema, data);
export const validateRoleUpdate = (data) => validate(roleUpdateSchema, data);

export default {
  validateCreateTeam,
  validateUpdateTeam,
  validateMemberAction,
  validateRoleUpdate,
};
