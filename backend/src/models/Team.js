import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "member", "viewer"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      minlength: [2, "Team name must be at least 2 characters"],
      maxlength: [100, "Team name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: {
      type: [teamMemberSchema],
      default: [],
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

teamSchema.index({ createdBy: 1, createdAt: -1 });
teamSchema.index({ "members.userId": 1 });
teamSchema.index({ name: "text", description: "text" });

teamSchema.pre("save", function (next) {
  if (this.members.length === 0 && this.createdBy) {
    this.members.push({
      userId: this.createdBy,
      role: "admin",
      joinedAt: new Date(),
    });
  }
  next();
});

teamSchema.methods.getMemberRole = function (userId) {
  const member = this.members.find(
    (entry) => entry.userId.toString() === userId.toString(),
  );
  return member ? member.role : null;
};

teamSchema.methods.isMember = function (userId) {
  return Boolean(
    this.members.find((entry) => entry.userId.toString() === userId.toString()),
  );
};

const Team = mongoose.model("Team", teamSchema);

export default Team;
