// Work with Curses collection in Mongo.

var mongoose   = require('mongoose');
var cursePurse = require('./models/curse');
var async      = require('async');

module.exports = {

    // @param {string} url Mongo db connection string
    // @param {callback} cb Callback method (err, boolean)
    dbConnect: function (url, cb) {
        mongoose.connect(url, function (err) {
            if (err) {
                return cb(err, false);
            } else {
                return cb(err, true);
            }
        });
    },

    // @param {string} wordText Text to add to cursed words
    // @param {callback} cb callback method
    addCurse: function (newCurseText, cb) {
        var str = new RegExp('^' + newCurseText + '$', 'i');
        // check to make sure not already in db?
        cursePurse.findOne({curse: str, ban: true}, function (err, res) {
            if (err) {
                return cb(err, false);
            } else if (res == null) {
                var curseWord   = new cursePurse();
                curseWord.curse = newCurseText;
                curseWord.save(function (err, res) {
                    if (err) {
                        return cb(err, false);
                    } else {
                        return cb(err, res);
                    }
                });
            } else {
                return cb(err, res);
            }
        });
    },

    // @param {callback} cb callback method
    getCurseList: function (cb) {
        cursePurse.find(function (err, res) {
            if (err) {
                return cb(err, false);
            } else {
                return cb(err, res);
            }
        });
    },

    // search for a word in db, return false if not a banned word
    // @param {callback} cb callback method
    // @return {boolean} bool true if word is found and Mongo search not null
    isCurse: function (curseWord, cb) {
        var str = new RegExp('^' + curseWord + '$', 'i');
        cursePurse.findOne({curse: str, ban: true}, function (err, res) {
            if (err || (res == null)) {
                return cb(err, false);
            } else {
                return cb(err, true);
            }
        });
    },

    // Loop through passed array and send each addCurse
    // @param {array} curseList Array of curses to add
    importCurses: function (curseList, cb) {
        async.map(curseList, this.addCurse, function (err, res) {
            return cb(err, res);
        });
    },

    // @param {callback} cb Callback method?
    getCurseCount: function (cb) {
        cursePurse.count(function (err, res) {
            if (err) {
                return cb(err, false);
            } else {
                return cb(err, res);
            }
        });

    },

    // Update a curse by id
    // @param {object} curseId Curse ID to update
    // @param {array} updateData Array of fields to update {curse: 'word', ban: true/false}
    // @param {callback} cb Callback method
    updateCurseById: function (curseId, updateData, cb) {
        cursePurse.findByIdAndUpdate(curseId, updateData, function (err) {
            if (err) {
                return cb(err, false);
            } else {
                return cb(err, true);
            }
        });
    },

    // search for a word in db, return object
    // @param {string} curse Curse word to find
    // @param {callback} cb Callback method
    getCurse: function (curse, cb) {
        var curseNoCase = new RegExp('^' + curse + '$', 'i');
        cursePurse.find({curse: curseNoCase}, function (err, res) {
            if (err) {
                return cb(err, false);
            } else {
                return cb(err, res);
            }
        });
    },

    // @param {string} curseId Mongo ID string of curse
    // @param {callback} cb Callback method
    getCurseById: function (curseId, cb) {
        cursePurse.findById(curseId, function (err, res) {
            if (err) {
                return cb(err, false);
            } else {
                return cb(err, res);
            }
        });
    },

    // @param {string} curseId Curse ID to remove.
    // @param {callback} cb Callback method
    // @return {boolean} Return true if curse removed.
    deleteCurseById: function (curseId, cb) {
        cursePurse.remove({
            _id: curseId
        }, function (err) {
            if (err) {
                return cb(err, false);
            } else {
                return cb(err, true);
            }
        });
    },

    // @param {callback} cb Callback method
    // @return {boolean} Return true if all curses removed.
    deleteAllCurses: function (cb) {
        cursePurse.remove({}, function (err) {
            if (err) {
                return cb(err, false);
            } else {
                return cb(err, true);
            }
        });
    },

    // @param {callback} cb Callback method
    // @return {boolean} Return true if all curses removed.
    deleteCurseDatabase: function (dbUrl, cb) {
        mongoose.connection.db.dropDatabase(function (err) {
            if (err) {
                return cb(err, false);
            } else {
                return cb(err, true);
            }
        });
    }

};
