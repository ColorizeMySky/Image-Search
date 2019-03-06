const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const querySchema = new Schema({
  name: String      
}, {
  timestamps: true
});

const Queries = mongoose.model('Query', querySchema);

module.exports = Queries;