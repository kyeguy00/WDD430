
const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
   id: { type: String, required: true },
   name: { type: String, required: true },
   email: { type: String, required: true },
   phone: { type: String, required: true },
   imageUrl: { type: String, required: true },
   sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact'},
   group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }
});

module.exports = mongoose.model('Contact', contactSchema);