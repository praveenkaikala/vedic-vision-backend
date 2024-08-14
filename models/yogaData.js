const mongoose = require('mongoose');

const YogaModel = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true // Ensure that userId is always provided
    },
    day: {
        type: String,
        default: "0" // Default value for day
    },
    calories: {
        type: String,
        default: "0" // Default value for calories
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "plans",
        default: null // Optional: if you want to allow plans to be optional
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Yoga = mongoose.models.Yoga || mongoose.model('Yogadata', YogaModel);
module.exports = Yoga;
