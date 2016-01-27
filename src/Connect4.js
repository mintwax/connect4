"use strict";

export function assert(condition, message) {
    if (!condition) {
        var msg = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(msg);
        }
        throw msg; // Fallback
    }
}

export class Connect4 {

    static get info() {
        return {
            MAX_ROWS: 6,
            MAX_COLUMNS: 7,
            PLAYER1: 1,
            PLAYER2: 2,
            EMPTY: 0
        };
    }

    constructor(initial_rack) {
        this.winner = null;
        this.last_move = null;
        this.winning_moves = [];
        this.reset_game();

        if (initial_rack) {
            this.rack = initial_rack;
        }

    }

    reset_game() {

        // array of columns, the top row below is the left side of the board
        this.rack = [ [ 0, 0, 0, 0, 0, 0 ],
                      [ 0, 0, 0, 0, 0, 0 ],
                      [ 0, 0, 0, 0, 0, 0 ],
                      [ 0, 0, 0, 0, 0, 0 ],
                      [ 0, 0, 0, 0, 0, 0 ],
                      [ 0, 0, 0, 0, 0, 0 ],
                      [ 0, 0, 0, 0, 0, 0 ]
                     ];

        if (this.winner === null || this.winner == Connect4.info.PLAYER2) {
            this.current_player = Connect4.info.PLAYER1;
        } else {
            this.current_player = Connect4.info.PLAYER2;
        }
    }

    // give a column i, returns the lowest empty row index
    // return -1 if column is full
    get_next_empty_slot(i) {

        var column = this.rack[i];
        var j;

        for (j = 0; j < Connect4.info.MAX_ROWS; j++) {
            if (column[j] == Connect4.info.EMPTY) {
                return j;
            }
        }

        return -1;
    }


    add_chip(player, position) {

        assert(position.column < Connect4.info.MAX_COLUMNS && position.column >= 0);
        assert(position.row < Connect4.info.MAX_ROWS && position.row >= 0, "MAX_ROWS exceeded.");
        assert(this.rack[position.column][position.row] == Connect4.info.EMPTY, "Duplicate move.");
        assert(position.row === 0 || this.rack[position.column][position.row-1] != Connect4.info.EMPTY, "Illegal Move: mid air suspension of chip not allowed.");

        this.rack[position.column][position.row] = player;
        this.last_move = position;
    }

    toggle_player() {

        if (this.current_player == Connect4.info.PLAYER1) {
            this.current_player = Connect4.info.PLAYER2;
        } else {
            this.current_player = Connect4.info.PLAYER1;
        }
    }

    detect_win(player, position) {

        var moves = [];
        var result;

        result = this.detect_horizontal_win(player, position);
        result.winning_moves.shift(); // remove the current position
        moves = moves.concat(result.winning_moves);

        result = this.detect_vertical_win(player, position);
        result.winning_moves.shift(); // remove the current position
        moves = moves.concat(result.winning_moves);

        result = this.detect_diaganol_forward_win(player, position);
        result.winning_moves.shift(); // remove the current position
        moves = moves.concat(result.winning_moves);

        result = this.detect_diaganol_backward_win(player, position);
        result.winning_moves.shift(); // remove the current position
        moves = moves.concat(result.winning_moves);

        if (moves.length > 0) {
            moves.push(position);
        }

        return {
            winning_moves: moves
        };
    }

    detect_horizontal_win(player, position) {

        var contiguous_right = 0;
        var contiguous_left = 0;
        var moves = [ position ];

        assert(this.rack[position.column][position.row] == player);

        for (let i = position.column+1; i < Connect4.info.MAX_COLUMNS; i++) {
            if (this.rack[i][position.row] == player) {
                contiguous_right++;
                moves.push( { column: i, row: position.row } );
            } else {
                break;
            }
        }

        for (let i = position.column-1; i >= 0; i--) {
            if (this.rack[i][position.row] == player) {
                contiguous_left++;
                moves.push( { column: i, row: position.row } );
            } else {
                break;
            }
        }

        if (moves.length < 4) {
            moves = [];
        }

        return {
            right: contiguous_right,
            left: contiguous_left,
            winning_moves: moves
        };
    }


    detect_vertical_win(player, position) {

        // var contiguous_up = 0;
        var contiguous_down = 0;
        var moves = [ position ];

        assert(this.rack[position.column][position.row] == player);

        /*
        in game situation, can never have chips on top of the current position
        for (let j = position.row+1; j < Connect4.info.MAX_ROWS; j++) {
            if (this.rack[position.column][j] == player) {
                contiguous_up++;
                moves.push( { column: position.column, row: j});
            } else {
                break;
            }
        }*/

        for (let j = position.row-1; j >= 0; j--) {
            if (this.rack[position.column][j] == player) {
                contiguous_down++;
                moves.push( { column: position.column, row: j});
            } else {
                break;
            }
        }

        if (moves.length < 4) {
            moves = [];
        }

        return {
        //    up: contiguous_up,
            down: contiguous_down,
            winning_moves: moves
        };

    }


    detect_diaganol_forward_win(player, position) {

        var contiguous_upright = 0;
        var contiguous_downleft = 0;
        var i = position.column+1;
        var j = position.row+1;
        var moves = [ position ];

        assert(this.rack[position.column][position.row] == player);

        while(i < Connect4.info.MAX_COLUMNS && j < Connect4.info.MAX_ROWS) {
            if (this.rack[i][j] == player) {
                contiguous_upright++;
                moves.push( { column: i, row: j});
                i++;
                j++;
            } else {
                break;
            }
        }

        i = position.column-1;
        j = position.row-1;
        while(i >= 0 && j >= 0) {
            if (this.rack[i][j] == player) {
                contiguous_downleft++;
                moves.push( { column: i, row: j});
                i--;
                j--;
            } else {
                break;
            }
        }

        if (moves.length < 4) {
            moves = [];
        }

        return {
            upright: contiguous_upright,
            downleft: contiguous_downleft,
            winning_moves: moves
        };

    }

    detect_diaganol_backward_win(player, position) {

        var contiguous_upleft = 0;
        var contiguous_downright = 0;
        var moves = [ position ];

        assert(this.rack[position.column][position.row] == player);

        var i = position.column-1;
        var j = position.row+1;
        while(i >= 0 && j < Connect4.info.MAX_ROWS) {
            if (this.rack[i][j] == player) {
                contiguous_upleft++;
                moves.push( { column: i, row: j});
                i--;
                j++;
            } else {
                break;
            }
        }

        i = position.column+1;
        j = position.row-1;
        while(i < Connect4.info.MAX_COLUMNS && j >= 0) {
            if (this.rack[i][j] == player) {
                contiguous_downright++;
                moves.push( { column: i, row: j});
                i++;
                j--;
            } else {
                break;
            }
        }

        if (moves.length < 4) {
            moves = [];
        }

        return {
            upleft: contiguous_upleft,
            downright: contiguous_downright,
            winning_moves: moves
        };
    }
}