const { UserAchievement, AchievementDefinition } = require('../models/Achievement')
const User = require('../models/User')
const { asyncHandler } = require('../middleware/auth')
const { successResponse } = require('../utils/responseHandler')

const ACHIEVEMENTS = [
  {
    id: 'first_workout',
    name: 'First Step',
    description: 'Completed your very first workout',
    icon: '🏃',
    category: 'workout',
    xpReward: 100,
    rarity: 'common',
    badgeColor: '#22c55e',
    requirement: { type: 'count', value: 1, metric: 'workouts' },
  },
  {
    id: 'streak_7',
    name: '7-Day Warrior',
    description: 'Maintained a 7-day workout streak',
    icon: '🔥',
    category: 'streak',
    xpReward: 300,
    rarity: 'rare',
    badgeColor: '#f97316',
    requirement: { type: 'streak', value: 7, metric: 'days' },
  },
  {
    id: 'streak_30',
    name: 'Iron Discipline',
    description: '30-day consistency warrior',
    icon: '⚡',
    category: 'streak',
    xpReward: 1000,
    rarity: 'epic',
    badgeColor: '#a855f7',
    requirement: { type: 'streak', value: 30, metric: 'days' },
  },
  {
    id: 'streak_100',
    name: 'Legendary Streak',
    description: '100 consecutive days of training',
    icon: '👑',
    category: 'streak',
    xpReward: 5000,
    rarity: 'legendary',
    badgeColor: '#eab308',
    requirement: { type: 'streak', value: 100, metric: 'days' },
  },
  {
    id: 'workouts_10',
    name: 'Getting Started',
    description: 'Completed 10 workouts total',
    icon: '💪',
    category: 'workout',
    xpReward: 200,
    rarity: 'common',
    badgeColor: '#22c55e',
    requirement: { type: 'count', value: 10, metric: 'workouts' },
  },
  {
    id: 'workouts_50',
    name: 'Half Century',
    description: '50 workouts completed',
    icon: '🎯',
    category: 'workout',
    xpReward: 500,
    rarity: 'rare',
    badgeColor: '#3b82f6',
    requirement: { type: 'count', value: 50, metric: 'workouts' },
  },
  {
    id: 'workouts_100',
    name: 'Century Club',
    description: '100 workouts. You are unstoppable.',
    icon: '🏆',
    category: 'workout',
    xpReward: 1500,
    rarity: 'epic',
    badgeColor: '#a855f7',
    requirement: { type: 'count', value: 100, metric: 'workouts' },
  },
  {
    id: 'first_goal',
    name: 'Goal Setter',
    description: 'Set your first fitness goal',
    icon: '🎯',
    category: 'milestone',
    xpReward: 50,
    rarity: 'common',
    badgeColor: '#22c55e',
    requirement: { type: 'count', value: 1, metric: 'goals' },
  },
  {
    id: 'water_streak',
    name: 'Hydration Hero',
    description: 'Met water intake goal 7 days in a row',
    icon: '💧',
    category: 'consistency',
    xpReward: 200,
    rarity: 'rare',
    badgeColor: '#06b6d4',
    requirement: { type: 'streak', value: 7, metric: 'water' },
  },
  {
    id: 'weight_loss_5',
    name: 'Fat Burner',
    description: 'Lost 5kg from starting weight',
    icon: '🔥',
    category: 'weight',
    xpReward: 500,
    rarity: 'rare',
    badgeColor: '#ef4444',
    requirement: { type: 'weight_loss', value: 5 },
  },
]

// ── Check and Award Achievements ──────────────────────────────────────────────
const checkAndAwardAchievements = async (userId) => {
  const user = await User.findById(userId)
  if (!user) return []

  const existingAchievements = await UserAchievement.find({ user: userId })
  const earnedIds = existingAchievements.map((a) => a.achievement)

  const newAchievements = []

  for (const achievement of ACHIEVEMENTS) {
    if (earnedIds.includes(achievement.id)) continue

    let earned = false

    switch (achievement.requirement.type) {
      case 'count':
        if (achievement.requirement.metric === 'workouts') {
          earned = user.gamification.totalWorkouts >= achievement.requirement.value
        }
        if (achievement.requirement.metric === 'goals') {
          earned = !!user.selectedGoal
        }
        break

      case 'streak':
        if (achievement.requirement.metric === 'days') {
          earned = user.gamification.streak.current >= achievement.requirement.value
        }
        break

      case 'weight_loss':
        const currentWeight = user.healthProfile?.weight?.value || 0
        const startWeight = user.bodyMetrics?.weightStatus?.current || 0
        const lost = Math.max(startWeight - currentWeight, 0)
        earned = lost >= achievement.requirement.value
        break

      default:
        break
    }

    if (earned) {
      const userAchievement = await UserAchievement.create({
        user: userId,
        achievement: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        rarity: achievement.rarity,
        xpEarned: achievement.xpReward,
        isUnread: true, // Fixed: was isNew
      })

      // Award XP
      user.gamification.xp += achievement.xpReward
      user.gamification.badges.push({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        earnedAt: new Date(),
      })
      await user.save()

      newAchievements.push(userAchievement)
    }
  }

  return newAchievements
}

// ── Get User Achievements ─────────────────────────────────────────────────────
const getUserAchievements = asyncHandler(async (req, res) => {
  const achievements = await UserAchievement.find({ user: req.user._id }).sort({
    earnedAt: -1,
  })

  // Mark as read (isUnread → false)
  await UserAchievement.updateMany(
    { user: req.user._id, isUnread: true },
    { isUnread: false }
  )

  const allAchievements = ACHIEVEMENTS.map((def) => {
    const earned = achievements.find((a) => a.achievement === def.id)
    return {
      ...def,
      earned: !!earned,
      earnedAt: earned?.earnedAt || null,
      isNew: earned?.isUnread || false, // Keep isNew for frontend display
    }
  })

  return successResponse(res, 200, 'Achievements fetched', {
    achievements: allAchievements,
    earned: achievements.length,
    total: ACHIEVEMENTS.length,
  })
})

// ── Check Achievements ────────────────────────────────────────────────────────
const checkAchievements = asyncHandler(async (req, res) => {
  const newAchievements = await checkAndAwardAchievements(req.user._id)

  return successResponse(res, 200, 'Achievements checked', {
    newAchievements,
    count: newAchievements.length,
  })
})

module.exports = {
  getUserAchievements,
  checkAchievements,
  checkAndAwardAchievements,
  ACHIEVEMENTS,
}