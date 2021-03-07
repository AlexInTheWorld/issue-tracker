const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  issue_title: {
    type: String,
    required: true
    },
  issue_text: {
    type: String,
    required: true
    },
  created_by: {
    type: String,
    required: true
    },
  created_on: Date,
  updated_on: Date,
  open: Boolean,
  assigned_to: String,
  status_text: String
});


// =============================== //

module.exports = projectSchema;
