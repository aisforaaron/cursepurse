// Work with Curses collection in Mongo.

var mongoose   = require('mongoose');
var cursePurse = require('./models/curse');

mongoose.set('debug', true); // @todo remove this line when done

module.exports = {

    // @param {string} url Mongo db connection string
    dbConnect: function (url) {
        mongoose.connect(url, function (err) {
            if (err) {
                console.log('Could not connect to database.', err);
                process.exit(1);
            }
        });
    },

    // @param {string} wordText Text to add to cursed words
    // @todo add text safe check before adding to db?
    addCurse: function (newCurseText) {
        var str = new RegExp('^' + newCurseText + '$', "i");
        // check to make sure not already in db?
        cursePurse.findOne({curse: str, ban: true}, function (err, res) {
            if (err) {
                throw err;
            } else if (res == null) {
                var curseWord   = new cursePurse();
                curseWord.curse = newCurseText;
                curseWord.save(function (err, res) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('Added new curse to purse.', newCurseText);
                    }
                });
            } else {
                console.log('Curse already in purse.');
            }
        });
    },

    // @param {callback} cb callback method
    getCurseList: function (cb) {
        cursePurse.find(function (err, res) {
            if (err) {
                throw err;
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
            if (err) {
                throw err;
            } else if (res == null) {
                return cb(false);
            } else {
                return cb(true);
            }
        });
    },

    // Loop through passed array and send each addCurse
    // @param {array} curseList Array of curses to add
    importCurses: function (curseList) {
        curseList.map(this.addCurse);
    },

    // @param {callback} cb Callback method?
    getCurseCount: function (cb) {
        cursePurse.count(function (err, res) {
            if (err) {
                throw err;
            } else {
                return cb(null, res);
            }
        });

    }

    // updateCurseById  -  update a word by id
    // getCurse  -  search for a word in db, return object
    // getCurseById  -  return a word collection by object id
    // getCurseCount  -  return # of words in db
    // deleteCurseById  -  remove a word from db by id
    // hideCurseByText  -  update show flag to false for a word by text match
    // deleteWordByText  -  remove a word by text matching, case-sensitive?

};
