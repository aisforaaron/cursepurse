# CursePurse
Node.js module that keeps a dictionary of words that you define are profane in your Node app.

## Module Goals
- Create a node module which stores words or phrases in a private Mongo DB collection which you can search against to see if you want your app to proceed with using that text.
- Many modules exist which use json files, but applications may then need to store bad word files in their project repo. CursePurse offloads that to a deploy or provision step, and keeps the words out of view of the public.

## Installation
- npm install cursepurse
- add require code and connect to db before using
  - `var cursepurse = require('cursepurse')`
  - `cursepurse.dbConnect('mongodb://localhost/local')`

## Code Conventions used
- Mongo collection is `curses`
- Objects created in code use name `cursePurse`
- Db model called from module is `cursePurse`
- Words or text stored in cursepurse are `curse` words

## Quick Example
- Add text to the db
  - `cursepurse.addCurse('your-words')`
- Check text for cursed word(s), will return true if word is banned
  - `if(cursepurse.isCurse('your-words')===false) {..ok to proceed..}`

## Example Usage
Require library and open db connection
```
var cursePurse = require('cursepurse');
cursePurse.dbConnect('mongodb://localhost/local');
```

Add a curse to the purse
```
cursePurse.addCurse('new-curse-word');
```

Get curse count
```
cursePurse.getCurseCount(function (err, res) {
  if (res) console.log('count', res);
});
```

Update a curse document
```
var updateData = {curse: 'new-word', ban: false};
cursePurse.updateCurseById('curse-id', updateData, function(err, res) {
    if (err) throw err;
    if (res === true) {
       console.log('updated curse');
    } else {
        console.log('did not update curse');
    }
});
```

Bulk import curses by json (passes to addCurse)
```
cursePurse.importCurses({'new-word', 'another-new', 'more stuff to add'});
```

Get list of all curses
```
cursePurse.getCurseList(function (err, res) {
    console.log('banned words', res);
});
```

Check word to see if it's a curse
```
cursePurse.isCurse(str, function(res){
    if (res) {
        console.log('this is banned!!!');
    } else {
        console.log('you are nice guy');
    }
});
```

Get a curse object
```
cursePurse.getCurse('new-word', function(err, res) {
    if (err) throw err;
    console.log('res', res);
});
```

Get a curse by id
```
cursePurse.getCurseById('id-here', function (err, res) {
    if (err) throw err;
    console.log('res', res);
});
```

Delete a curse by id
```
cursePurse.deleteCurseById('id-here', function (err, res) {
    if (err) throw err;
    console.log('res', res);
});
```