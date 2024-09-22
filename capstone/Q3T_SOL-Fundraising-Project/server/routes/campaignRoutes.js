// routes/campaignRoutes.js
const { check } = require('express-validator');
const app = require('express');
const { getAllCampaigns, getCampaignById, createCampaign, checkActiveCampaign, getAllCampaignsRoute, updateCampaign, updateCampaignClose } = require('../controllers/campaignController');
const protect = require('../middleware/authMiddleware');

// Add validation for campaign creation
const router = app.Router();

router.post(
    '/create',
    protect,
    [
        check('title', 'Title is required').not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        check('goal', 'Goal must be a positive number').isFloat({ gt: 0 })
    ],
    createCampaign
);

router.get('/', protect, getAllCampaigns);

router.get('/all', getAllCampaignsRoute);

router.put('/:id', updateCampaign);

router.put('/close/:id', updateCampaignClose);

router.get('/check', protect, checkActiveCampaign);

// Route to get a campaign by ID (public)
router.get('/:id', protect, getCampaignById);


module.exports = router;