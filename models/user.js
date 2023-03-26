const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an Email!'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
  },
  googleId: {
    type: String,
  },
});

module.exports = mongoose.model('User', UserSchema);




