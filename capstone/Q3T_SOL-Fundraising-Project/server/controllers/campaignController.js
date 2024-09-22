// controllers/campaignController.js
const { default: mongoose } = require('mongoose');
const Campaign = require('../models/campaign');
const User = require('../models/user');

// @route   POST /api/campaigns/create
// @desc    Create a new campaign
// @access  Private
const createCampaign = async (req, res) => {
    const { title, description, targetAmount, publickKey, endDate, whyCare, tag, campaignProgramId, campaignImage, privatekey } = req.body;

    try {
        // Create a new campaign
        const campaign = new Campaign({
            title,
            description,
            targetAmount,
            endDate,
            tag,
            whyCare,
            creator: req.user._id,
            campaignProgramId,
            campaignImage,
            privatekey,
            publickKey, // User is added to request by the auth middleware
        });

        await campaign.save();

        // Add the campaign to the user's campaigns array
        const user = await User.findById(req.user._id);
        user.campaigns.push(campaign._id);
        await user.save();

        res.status(201).json(campaign);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @route   GET /api/campaigns/:id
// @desc    Get campaign by ID
// @access  Public
const getAllCampaigns = async (req, res) => {
    // console.log(req.user);
    const id = req.user._id;
    const creatorId = new mongoose.Types.ObjectId(id);
    try {
        const campaigns = await Campaign.find({ creator: id }).populate('creator', 'name email'); // Populate creator details
        if (!campaigns) return res.json([]);
        res.json(campaigns);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @route   GET /api/campaigns/:id
// @desc    Get campaign by ID
// @access  Public
const getAllCampaignsRoute = async (req, res) => {
    try {
        const campaigns = await Campaign.find().populate('creator', 'name email'); // Populate creator details
        if (!campaigns) return res.json([]);
        res.json(campaigns);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @route   GET /api/campaigns/:id
// @desc    Get campaign by ID
// @access  Public
const getCampaignById = async (req, res) => {
    try {
        const campaign = await Campaign.findOne({ _id: req.params.id }).populate('creator', 'name email');

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        res.json(campaign);
    } catch (error) {
        console.error(error.message);

        // If error is due to an invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        res.status(500).send('Server error');
    }
};

const checkActiveCampaign = async (req, res) => {
    console.log('Checking active campaign');
    try {
        const userId = req.user._id;
        const activeCampaign = await Campaign.findOne({ creator: userId, status: 'Active' });
        if (activeCampaign) {
            return res.status(200).json({ message: 'You already have an active campaign running.' });
        }
        return res.status(200).json({ message: 'false' });
    } catch (error) {
        return res.status(500).json({ message: 'Error checking for active campaign', error });
    }
};

const updateCampaign = async (req, res) => {
    try {
        const { publicKey, amount } = req.body;
        const id = req.params.id;
        console.log(id);
        const activeCampaign = await Campaign.findOne({ _id: id });
        if (!activeCampaign) {
            return res.status(200).json({ message: 'No campaign found.' });
        }
        const keys = activeCampaign.contributorsPublicKeys || [];
        keys.push(publicKey);
        activeCampaign.
            currentAmount = Number(activeCampaign.currentAmount) + Number(amount);
        activeCampaign.contributorsPublicKeys = keys
        await activeCampaign.save();

        return res.status(200).json(activeCampaign);
    } catch (error) {
        return res.status(500).json({ message: 'Error checking for active campaign', error });
    }
};


const updateCampaignClose = async (req, res) => {
    try {
        const id = req.params.id;
        const activeCampaign = await Campaign.findOne({ _id: id });
        if (!activeCampaign) {
            return res.status(200).json({ message: 'No campaign found.' });
        }
        activeCampaign.status = "Completed";
        await activeCampaign.save();

        return res.status(200).json(activeCampaign);
    } catch (error) {
        return res.status(500).json({ message: 'Error checking for active campaign', error });
    }
};

module.exports = { createCampaign, getAllCampaigns, getCampaignById, checkActiveCampaign, updateCampaign, getAllCampaignsRoute, updateCampaignClose };
