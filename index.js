// Work with Curses collection in Mongo.

var mongoose   = require('mongoose');
var cursePurse = require('./models/curse');
var async      = require('async');

module.exports = {

    // @param {mixed} db Mongoose connection object or new url connection string
    // @param {callback} cb Callback method (err, boolean)
    dbConnect: function (db, cb) {
        if (typeof db === 'object') {
            return db; // just passing mongoose object into cursePurse, no new connection
        } else if (typeof db === 'string') {
            mongoose.connect(db, function (err) {
                if (err) {
                    return cb(err, false);
                } else {
                    return cb(err, true);
                }
            });
        }
    },

    // @param {string} wordText Text to add to cursed words
    // @param {callback} cb callback method
    addCurse: function (newCurseText, cb) {
        // escape special chars http://stackoverflow.com/a/17493954
        var strEsc = newCurseText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        var str    = new RegExp('^' + strEsc + '$', 'i');
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

    // search for a word or phrase in db, return false if not a banned word
    // @param {callback} cb callback method
    // @return {boolean} bool true if word is found and Mongo search not null
    isCurse: function (curseWord, cb) {
        // loop through each word in phrase to check for bad words
        // using async lib, this will check each item before returning final result
        async.each(curseWord.split(/\s+|_+|-+|\++/g), function(item, callback) {
            var str = new RegExp('^' + item + '$', 'i');
            cursePurse.findOne({curse: str, ban: true}, function (err, res) {
                if (err || (res !== null)) {
                    callback(true); // it's a curse!
                } else {
                    callback(false); // clean
                }
            });
        }, function(err){
            if (err) {
                return cb(err, true); // it's a curse!
            } else {
                return cb(err, false); // clean
            }
        });
    },

    // Loop through passed array and send each addCurse
    // @param {array} curseList Array of curses to add
    // @return {object} err, res object returned without callback method
    importCurses: function (curseList, cb) {
        async.map(curseList, this.addCurse, function (err, res) {
            return cb(err, res);
        });
    },

    // @param {callback} cb Callback method
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
