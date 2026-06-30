const mongoose = require('mongoose')

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true, default: Date.now },

    weight: Number,
    bodyFat: Number,
    muscleMass: Number,

    measurements: {
      chest: Number,
      waist: Number,
      hips: Number,
      bicep: Number,
      thigh: Number,
      neck: Number,
      shoulder: Number,
      calf: Number,
    },

    bmi: Number,
    bmiCategory: String,

    nutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      water: { type: Number, default: 0 },
      caloriesTarget: Number,
      proteinTarget: Number,
      carbsTarget: Number,
      fatTarget: Number,
      waterTarget: Number,
    },

    workout: {
      completed: { type: Boolean, default: false },
      duration: Number,
      caloriesBurned: Number,
      exercises: Number,
      workoutType: String,
      intensity: { type: String, enum: ['low', 'medium', 'high'] },
      notes: String,
    },

    steps: {
      count: { type: Number, default: 0 },
      caloriesBurned: { type: Number, default: 0 },
      distance: { type: Number, default: 0 },
      target: { type: Number, default: 10000 },
      lastUpdate: Date,
    },

    sleep: {
      hours: Number,
      quality: { type: String, enum: ['poor', 'fair', 'good', 'excellent'] },
    },

    mood: { type: String, enum: ['terrible', 'bad', 'okay', 'good', 'great'] },
    energyLevel: { type: Number, min: 1, max: 10 },
    photos: [{ public_id: String, url: String, type: String, uploadedAt: Date }],
    notes: String,
  },
  { timestamps: true }
)

progressSchema.index({ user: 1, date: -1 })

module.exports = mongoose.model('Progress', progressSchema)