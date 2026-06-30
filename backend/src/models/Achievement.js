const mongoose = require('mongoose')

const achievementDefinitionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: String,
    category: {
      type: String,
      enum: [
        'streak',
        'workout',
        'nutrition',
        'weight',
        'consistency',
        'social',
        'milestone',
      ],
    },
    requirement: {
      type: {
        type: String,
        enum: ['streak', 'count', 'weight_loss', 'weight_gain', 'percentage'],
      },
      value: Number,
      metric: String,
    },
    xpReward: { type: Number, default: 100 },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common',
    },
    badgeColor: String,
    isSecret: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const userAchievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    achievement: {
      type: String,
      required: true,
    },
    name: String,
    description: String,
    icon: String,
    category: String,
    rarity: String,
    xpEarned: Number,
    earnedAt: {
      type: Date,
      default: Date.now,
    },

    // FIXED: renamed from 'isNew' (reserved) to 'isUnread'
    isUnread: {
      type: Boolean,
      default: true,
    },

    progress: {
      current: Number,
      required: Number,
    },
  },
  {
    timestamps: true,
    // Suppress any remaining reserved key warnings
    suppressReservedKeysWarning: true,
  }
)

userAchievementSchema.index({ user: 1 })

const AchievementDefinition = mongoose.model(
  'AchievementDefinition',
  achievementDefinitionSchema
)
const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema)

module.exports = { AchievementDefinition, UserAchievement }