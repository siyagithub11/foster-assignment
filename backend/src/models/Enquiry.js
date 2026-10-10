const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    phone: { type: String, trim: true },
    courseInterest: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
    // null => public enquiry, set => private (claimed by that counselor)
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null, index: true },
    claimedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);