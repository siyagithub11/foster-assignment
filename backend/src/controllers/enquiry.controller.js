const mongoose = require('mongoose');
const Enquiry = require('../models/Enquiry');

// POST /api/public/enquiries (no auth)
exports.createPublicEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, courseInterest, message } = req.body;
    if (!name || !email || !courseInterest) {
      return res
        .status(400)
        .json({ success: false, message: 'name, email and courseInterest are required' });
    }

    // claimedBy body se nahi lete, taaki form se pre-claimed lead na bane
    const enquiry = await Enquiry.create({ name, email, phone, courseInterest, message });
    res.status(201).json({ success: true, message: 'Enquiry submitted', enquiry });
  } catch (err) {
    next(err);
  }
};

// GET /api/enquiries/unclaimed
exports.getUnclaimed = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find({ claimedBy: null }).sort({ createdAt: -1 });
    res.json({ success: true, count: enquiries.length, enquiries });
  } catch (err) {
    next(err);
  }
};

// GET /api/enquiries/mine
exports.getMine = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find({ claimedBy: req.user._id }).sort({ claimedAt: -1 });
    res.json({ success: true, count: enquiries.length, enquiries });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/enquiries/:id/claim
exports.claimEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry id' });
    }

    // Atomic update: sirf tab chalega jab enquiry abhi bhi unclaimed ho
    const enquiry = await Enquiry.findOneAndUpdate(
      { _id: id, claimedBy: null },
      { claimedBy: req.user._id, claimedAt: new Date() },
      { new: true }
    );

    if (enquiry) {
      return res.json({ success: true, message: 'Enquiry claimed', enquiry });
    }

    const existing = await Enquiry.findById(id).select('_id claimedBy');
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    return res.status(409).json({ success: false, message: 'Enquiry is already claimed' });
  } catch (err) {
    next(err);
  }
};