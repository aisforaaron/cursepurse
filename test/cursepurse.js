// CursePurse Test Script

var assert     = require('assert');
var cursePurse = require('cursepurse');
var cpTest     = {
    dbUrl: 'mongodb://localhost/cptest',
    curseWord: 'dirty words',
    cleanWord: 'clean room',
    importList: ['red', 'blue', 'green', 'yellow']
};

describe('DB Connect', function () {
    it('dbConnect - CursePurse DB connect.', function () {
        cursePurse.dbConnect(cpTest.dbUrl, function (err, res) {
            assert.equal(res, true);
        });
    });
});

describe('Curse Purse method testing.', function () {
    it('addCurse - Add new Curse.', function (done) {
        cursePurse.addCurse(cpTest.curseWord, function (err, res) {
            console.log('Res object', res);
            assert.equal(res.curse, cpTest.curseWord);
            done();
        });
    });
    it('getCurseCount - Get Curse Count.', function (done) {
        cursePurse.getCurseCount(function (err, res) {
            assert.equal(res, '1');
            done();
        });
    });
    it('getCurseList - Get Curse List.', function (done) {
        cursePurse.getCurseList(function (err, res) {
            assert(typeof res == 'object');
            done();
        });
    });
    it('isCurse - Check word for curse (true for curse).', function (done) {
        cursePurse.isCurse(cpTest.curseWord, function (err, res) {
            assert.equal(res, true);
            done();
        });
    });
    it('isCurse - Check word for curse (false for clean).', function (done) {
        cursePurse.isCurse(cpTest.cleanWord, function (err, res) {
            assert.equal(res, false);
            done();
        });
    });
    it('importCurses - Import curses from array.', function (done) {
        cursePurse.importCurses(cpTest.importList, function (err, res) {
            cursePurse.getCurseCount(function (errCount, resCount) {
                console.log('curse count of importList', cpTest.importList.length);
                assert.equal(resCount, cpTest.importList.length + 1);
                done();
            });
        });
    });
});

describe('Curse Purse test db cleanup.', function (done) {
    it('deleteAllCurses - Remove all curses from collection.', function () {
        cursePurse.deleteAllCurses(function (err, res) {
            assert.equal(res, '1');
            done();
        });
    });
});