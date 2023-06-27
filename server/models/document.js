
const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String },
  url: { type: String, required: true },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }
});

module.exports = mongoose.model('Document', documentSchema);