# CursePurse
Node.js module that keeps a dictionary of words that you define are profane in your Node app.

## Module Goals
- Create a node module which stores words or phrases in a private Mongo DB collection which you can search against to see if you want your app to proceed with using that text.
- Many modules exist which use json files, but applications may then need to store bad word files in their project repo. CursePurse offloads that to a deploy or provision step, and keeps the words out of view of the public.

## Installation
- Mongo must already be installed on the server you will use.
- Install NPM package (--save to update your app package.json file)
    ```
    $ npm install cursepurse --save
    ```
- Review example usage section or the test/cursepurse.js test file.

## Code Conventions used
- Mongo collection is `curses`
- Objects created in code use name `cursePurse`
- Db model called from module is `cursePurse`
- Words or text stored in cursepurse are `curse` words

## Test Cases with Mocha
- You may need to install the devDependencies or just install [Mocha](https://mochajs.org) globally.
- Test file will create a new Mongo DB, collection and data to test with, then delete the data after each run.
- Test files found in the 'test' dir can be run from command line. This command will run the Makefile which is set to use Mocha.
    ```
    $ npm test
    ```

## Example Usage
Require library and open db connection.
```
var cursePurse = require('cursepurse');
cursePurse.dbConnect('mongodb://localhost/local');
```

Add a curse to the purse.
```
cursePurse.addCurse('new-curse-word', function (err, res) {
  ...
});
```

Check word to see if it's a curse.
```
cursePurse.isCurse(str, function(err, res){
    if (res) {
        console.log('this is banned!!!');
    } else {
        console.log('you are nice guy');
    }
});
```
