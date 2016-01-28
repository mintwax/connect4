
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

## To Run

Using webpack+babel to transform the es6 javascript to es5 from the src/ directory and put it into build/bundle.js

```
npm install
npm run build
```

Then open up static/index.html in your browser.

Tested on chromium 45 on ubuntu 14.

## References

Got the images from this website: http://www.cssplay.co.uk/menu/cssplay-connect-four.html



## Game Features TODO:
- user undos previous move (animate, option to disable/enable at new game)
- user hears sound of chip sliding and dropping (duration based on distance)
- user sees a draw game (no more moves)
- user forfeits game
- user sees winning connect4s
- user sees player stats.  maintain history of wins for each player.
      alternate who goes first because first player can always win

## Tooling TODO

- setup webpack dev server
- webpack to include jquery js into bundle.js ??


