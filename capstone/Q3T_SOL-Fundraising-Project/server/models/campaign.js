// models/Campaign.js
const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    targetAmount: {
        type: Number,
        required: true,
    },
    currentAmount: {
        type: String,
        default: 0,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tag: String,
    whyCare: [],
    contributorsPublicKeys: [],
    endDate: {
        type: Date,
        default: Date.now,
    },
    campaignImage: {
        type: String,
        required: true,
    },
    campaignProgramId: {
        type: String,
        // required: true,
    },
    privateKey: String,
    publickKey: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Completed"],
        default: "Active",
    }
});

module.exports = mongoose.model('Campaign', CampaignSchema);
