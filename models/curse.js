/**
 * Curse schema.
 * @param {string} curse Word or phrase to check against
 * @param {boolean} ban Flag to check if text should be used for comparison
 */

var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var CurseSchema = new Schema({
    curse: {type: String},
    ban: {type: Boolean, default: true}
});
module.exports  = mongoose.model('Curse', CurseSchema);
