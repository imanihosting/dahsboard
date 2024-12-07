const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  user_type: {
    type: String,
    enum: ['parent', 'childminder'],
    required: true
  },
  address: {
    line1: String,
    line2: String,
    city: String,
    county: String,
    eircode: String
  },
  profile_completed: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema); 