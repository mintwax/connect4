
# Connect Four


## Description

The classic game of wits and dexterity for ages 2 to 92.  Get four or more in a row to win.  Can be diaganol, vertical or horizontal.

![Alt text](/static/screenshot.jpg?raw=true "Screenshot")


## Unit testing

Tests are written using karma, jasmine, phantomjs for unit testing.  To run the unit tests:

```
npm install
npm run test
```

## To Build

Using webpack+babel to transform the es6 javascript to es5 from the src/ directory and put it into build/bundle.js.  This step has already been done and checked into git.

```
npm install
npm run build
```

npm --version == 2.14.4
nodejs --version == v0.10.25


## To Play

1. clone the repo

2. open up static/index.html in your chromium browser.

Tested on chromium 45 on ubuntu 14.

## Source

src/

1. main.js - this handles the ux such as clicks and animation
2. Connect4.js - stores the rack and moves and detects wins

static/

1. connect4.css - keyframe animation, styles
2. various image files
3. lib/ contains the jquery js file

build/

1. bundle.js - webpack+babel generated from src/*js

tests/

1. Connect4Spec.js - Connect4.js unit test cases
2. HelperSpec.js - customer matchers


## References

Got the images from this website: http://www.cssplay.co.uk/menu/cssplay-connect-four.html


## Game Features TODO:
- user undos previous move (animate, option to disable/enable at new game)
- user hears sound of chip sliding and dropping (duration based on distance)
- user sees a draw game (no more moves)
- user forfeits game
- user sees player stats.  maintain history of wins for each player.
      alternate who goes first because first player can always win

## Tooling TODO

- setup webpack dev server
- webpack to include jquery js into bundle.js ??, use jquery node module?
- refactor the karma config and webpack config to remove duplicate info


