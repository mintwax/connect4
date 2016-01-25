"use strict";

import { assert } from '../src/Connect4.js';
import { Connect4 } from '../src/Connect4.js';

var o = Connect4.info.PLAYER1;
var x = Connect4.info.PLAYER2;

describe("assert", function() {
  it("should throw an exception when false", function() {
    expect(function() {
        assert(false);
      }).toThrowError("Assertion failed");
  });

  it("should throw an exception with msg when false", function() {
    expect(function() {
        assert(false, "assertion message");
      }).toThrowError("assertion message");
  });

});


describe("rack operations", function() {

    it("should be empty when initialized", function() {

        var actual = new Connect4();

        var expected = new Connect4( [ [ 0, 0, 0, 0, 0, 0 ],
                                       [ 0, 0, 0, 0, 0, 0 ],
                                       [ 0, 0, 0, 0, 0, 0 ],
                                       [ 0, 0, 0, 0, 0, 0 ],
                                       [ 0, 0, 0, 0, 0, 0 ],
                                       [ 0, 0, 0, 0, 0, 0 ],
                                       [ 0, 0, 0, 0, 0, 0 ]
                                    ]);

        expect(actual).hasRackEqualTo(expected);
        expect(actual.current_player).toEqual(o);
    });


    it("should get next empty slot", function() {

        var actual = new Connect4();
        var expected;

        expect(actual.get_next_empty_slot(0)).toEqual(0);
        actual.add_chip(o, { column: 0, row: 0});

        expected = new Connect4( [ [ o, 0, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ]
                                ]);

        expect(actual).hasRackEqualTo(expected);
        expect(actual.get_next_empty_slot(0)).toEqual(1);
        actual.add_chip(x, { column: 0, row: 1});

        expected = new Connect4( [ [ o, x, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ]
                                ]);

        expect(actual).hasRackEqualTo(expected);

    });

    it("should not allow illegal mid air move", function() {

        var actual = new Connect4();

        expect(function() {
            actual.add_chip(o, { column: 0, row: 1});
        }).toThrowError("Illegal Move: mid air suspension of chip not allowed.");

    });


    it("should not allow move to column that is full", function() {

        var actual = new Connect4();

        actual.add_chip(o, { column: 0, row: 0});
        actual.add_chip(x, { column: 0, row: 1});
        actual.add_chip(o, { column: 0, row: 2});
        actual.add_chip(x, { column: 0, row: 3});
        actual.add_chip(o, { column: 0, row: 4});
        actual.add_chip(x, { column: 0, row: 5});

        var expected = new Connect4( [ [ o, x, o, x, o, x ],
                                       [ 0, 0, 0, 0, 0, 0 ],
                                       [ 0, 0, 0, 0, 0, 0 ],
                                       [ 0, 0, 0, 0, 0, 0 ],
                                       [ 0, 0, 0, 0, 0, 0 ],
                                       [ 0, 0, 0, 0, 0, 0 ],
                                       [ 0, 0, 0, 0, 0, 0 ]
                                    ]);

        expect(actual).hasRackEqualTo(expected);

        expect(function() {
          actual.add_chip(o, { column: 0, row: 6});
        }).toThrowError("MAX_ROWS exceeded.");
    });


    it("should not allow duplicate move", function() {

        var actual = new Connect4();
        actual.add_chip(o, { column: 0, row: 0});

        expect(function() {
          actual.add_chip(x, { column: 0, row: 0});
        }).toThrowError("Duplicate move.");
    });


    it("should detect horizontal win", function() {

        var actual = new Connect4();
        var expected;
        var result;

        // put in 3 chips first
        actual.add_chip(o, { column: 0, row: 0});
        actual.add_chip(o, { column: 1, row: 0});
        actual.add_chip(o, { column: 2, row: 0});
        result = actual.detect_horizontal_win(o, actual.last_move);
        expect(result.right).toEqual(0);
        expect(result.left).toEqual(2);
        expect(actual.winning_moves).toEqual([]);

        // put in 4th connect4 chip
        actual.add_chip(o, { column: 3, row: 0});
        expected = new Connect4( [ [ o, 0, 0, 0, 0, 0 ],
                                   [ o, 0, 0, 0, 0, 0 ],
                                   [ o, 0, 0, 0, 0, 0 ],
                                   [ o, 0, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ]
                                ]);

        expect(actual).hasRackEqualTo(expected);

        result = actual.detect_horizontal_win(o, actual.last_move);
        expect(result.right).toEqual(0);
        expect(result.left).toEqual(3);
        expect(result.winning_moves).hasPositionsEqualTo([ { column: 3, row: 0},
                                                           { column: 2, row: 0},
                                                           { column: 1, row: 0},
                                                           { column: 0, row: 0}
                                                        ]);

        // add two more chips
        actual.add_chip(o, { column: 5, row: 0});
        actual.add_chip(o, { column: 6, row: 0});

        expected = new Connect4( [ [ o, 0, 0, 0, 0, 0 ],
                                   [ o, 0, 0, 0, 0, 0 ],
                                   [ o, 0, 0, 0, 0, 0 ],
                                   [ o, 0, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ],
                                   [ o, 0, 0, 0, 0, 0 ],
                                   [ o, 0, 0, 0, 0, 0 ]
                                ]);

        expect(actual).hasRackEqualTo(expected);

        // detect chips to left and right
        actual.add_chip(o, { column: 4, row: 0});
        expected = new Connect4( [ [ o, 0, 0, 0, 0, 0 ],
                                       [ o, 0, 0, 0, 0, 0 ],
                                       [ o, 0, 0, 0, 0, 0 ],
                                       [ o, 0, 0, 0, 0, 0 ],
                                       [ o, 0, 0, 0, 0, 0 ],
                                       [ o, 0, 0, 0, 0, 0 ],
                                       [ o, 0, 0, 0, 0, 0 ]
                                    ]);

        expect(actual).hasRackEqualTo(expected);

        result = actual.detect_horizontal_win(o, actual.last_move);
        expect(result.right).toEqual(2);
        expect(result.left).toEqual(4);
        expect(result.winning_moves).hasPositionsEqualTo([ { column: 4, row: 0},
                                                           { column: 5, row: 0},
                                                           { column: 6, row: 0},
                                                           { column: 3, row: 0},
                                                           { column: 2, row: 0},
                                                           { column: 1, row: 0},
                                                           { column: 0, row: 0},
                                                        ]);

        actual.rack[4][0] = x;
        result = actual.detect_horizontal_win(x, { column: 4, row: 0});
        expect(result.right).toEqual(0);
        expect(result.left).toEqual(0);
        expect(result.winning_moves).hasPositionsEqualTo([]);
    });

    it("should detect vertical win", function() {

        var actual = new Connect4();
        var expected;
        var result;

        actual.add_chip(o, { column: 1, row: 0});
        actual.add_chip(o, { column: 1, row: 1});
        actual.add_chip(o, { column: 1, row: 2});

        result = actual.detect_vertical_win(o, actual.last_move);
        expect(result.down).toEqual(2);
        expect(result.winning_moves).toEqual([]);

        actual.add_chip(o, { column: 1, row: 3});

        expected = new Connect4( [ [ 0, 0, 0, 0, 0, 0 ],
                                   [ o, o, o, o, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ],
                                   [ 0, 0, 0, 0, 0, 0 ]
                                ]);

        expect(actual).hasRackEqualTo(expected);

        result = actual.detect_vertical_win(o, actual.last_move);
        expect(result.down).toEqual(3);
        expect(result.winning_moves).hasPositionsEqualTo([ { column: 1, row: 3},
                                                           { column: 1, row: 2},
                                                           { column: 1, row: 1},
                                                           { column: 1, row: 0}
                                                        ]);
    });


   it("should detect diaganol forward win", function() {

        var actual;
        var result;

        actual = new Connect4( [ [ o, 0, 0, 0, 0, 0 ],
                                 [ x, o, x, 0, 0, 0 ],
                                 [ o, x, o, 0, 0, 0 ],
                                 [ o, o, x, 0, 0, 0 ],
                                 [ x, 0, 0, 0, 0, 0 ],
                                 [ x, x, 0, 0, 0, 0 ],
                                 [ 0, 0, 0, 0, 0, 0 ]
                              ]);

        result = actual.detect_diaganol_forward_win(o, { column: 2, row: 2});
        expect(result.downleft).toEqual(2);
        expect(result.upright).toEqual(0);
        expect(result.winning_moves).toEqual([]);

        actual.add_chip(o, { column: 3, row: 3});
        result = actual.detect_diaganol_forward_win(o, actual.last_move);
        expect(result.downleft).toEqual(3);
        expect(result.upright).toEqual(0);
        expect(result.winning_moves).hasPositionsEqualTo([ { column: 3, row: 3},
                                                           { column: 2, row: 2},
                                                           { column: 1, row: 1},
                                                           { column: 0, row: 0}
                                                        ]);

        actual = new Connect4( [ [ o, 0, 0, 0, 0, 0 ],
                                 [ x, o, x, 0, 0, 0 ],
                                 [ o, x, o, 0, 0, 0 ],
                                 [ o, o, x, 0, 0, 0 ],
                                 [ x, x, x, o, o, 0 ],
                                 [ x, x, o, x, x, o ],
                                 [ 0, 0, 0, 0, 0, 0 ]
                              ]);
        actual.add_chip(o, { column: 3, row: 3});
        result = actual.detect_diaganol_forward_win(o, actual.last_move);
        expect(result.downleft).toEqual(3);
        expect(result.upright).toEqual(2);
        expect(result.winning_moves).hasPositionsEqualTo([ { column: 3, row: 3},
                                                           { column: 4, row: 4},
                                                           { column: 5, row: 5},
                                                           { column: 2, row: 2},
                                                           { column: 1, row: 1},
                                                           { column: 0, row: 0}
                                                        ]);
    });

   it("should detect diaganol backward win", function() {

        var actual;
        var result;

        actual = new Connect4( [ [ o, 0, 0, 0, 0, 0 ],
                                 [ x, o, x, 0, 0, 0 ],
                                 [ o, x, o, x, 0, 0 ],
                                 [ o, o, x, 0, 0, 0 ],
                                 [ x, 0, 0, 0, 0, 0 ],
                                 [ x, x, 0, 0, 0, 0 ],
                                 [ 0, 0, 0, 0, 0, 0 ]
                              ]);

        result = actual.detect_diaganol_backward_win(x, { column: 3, row: 2});
        expect(result.upleft).toEqual(1);
        expect(result.downright).toEqual(0);
        expect(result.winning_moves).toEqual([]);

        actual.add_chip(x, { column: 4, row: 1});
        result = actual.detect_diaganol_backward_win(x, actual.last_move);
        expect(result.upleft).toEqual(2);
        expect(result.downright).toEqual(1);
        expect(result.winning_moves).hasPositionsEqualTo([ { column: 4, row: 1},
                                                           { column: 3, row: 2},
                                                           { column: 2, row: 3},
                                                           { column: 5, row: 0}
                                                        ]);
    });


   it("should detect multiple directions win", function() {

        var actual;
        var result;
        var expectedPositions;

        actual = new Connect4( [ [ o, 0, 0, 0, 0, 0 ],
                                 [ x, o, x, x, x, o ],
                                 [ o, x, o, x, o, 0 ],
                                 [ o, o, o, 0, 0, 0 ],
                                 [ x, x, o, o, 0, 0 ],
                                 [ x, x, x, o, 0, 0 ],
                                 [ x, x, x, o, 0, 0 ]
                              ]);

        result = actual.detect_win(o, { column: 3, row: 2});
        expect(result.winning_moves).toEqual([]);

        actual.add_chip(o, { column: 3, row: 3});
        result = actual.detect_win(o, actual.last_move);

        expectedPositions = [
                              { column: 4, row: 3}, // horizontal
                              { column: 5, row: 3},
                              { column: 6, row: 3},
                              { column: 3, row: 2}, // vertical
                              { column: 3, row: 1},
                              { column: 3, row: 0},
                              { column: 3, row: 2}, // upright, downleft
                              { column: 1, row: 1},
                              { column: 0, row: 0},
                              { column: 2, row: 4}, // upleft, downright
                              { column: 1, row: 5},
                              { column: 4, row: 2},
                              { column: 3, row: 3}
                              ];

        expect(result.winning_moves).hasPositionsEqualTo(expectedPositions);
  });


});