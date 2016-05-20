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

## Usage
- Add text to the db
  - `cursepurse.addCurse('your-words')`
- Check text for cursed word(s), will return true if word is banned
  - `if(cursepurse.isCurse('your-words')===false) {..ok to proceed..}`

## Code Conventions used
- Mongo collection is `curses`
- Objects created in code use name `cursePurse`
- Db model called from module is `cursePurse`
- Words or text stored in cursepurse are `curse` words
