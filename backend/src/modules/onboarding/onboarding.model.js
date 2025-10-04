import mongoose from "mongoose";

const onboardingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    steps: {
      welcome: {
        type: Boolean,
        default: false,
      },
      profile: {
        type: Boolean,
        default: false,
      },
      preferences: {
        type: Boolean,
        default: false,
      },
    },
    profileData: {
      avatar: {
        type: String,
        default: null,
      },
      bio: {
        type: String,
        maxlength: 500,
      },
      interests: [{
        type: String,
      }],
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
        sound: {
          type: Boolean,
          default: true,
        },
      },
      privacy: {
        showOnlineStatus: {
          type: Boolean,
          default: true,
        },
        showLastSeen: {
          type: Boolean,
          default: true,
        },
        allowDirectMessages: {
          type: Boolean,
          default: true,
        },
      },
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Create index for better query performance
onboardingSchema.index({ user: 1 });

const Onboarding = mongoose.model("Onboarding", onboardingSchema);

export default Onboarding;
