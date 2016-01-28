/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Connect = __webpack_require__(1);

	var ANIMATE_DELAY_MS = 10;
	var ANIMATE_DURATION_MS = 500; // needs to match animation-duration in css
	var LEFT_PADDING_PX = 10;
	var SQUARE_SIZE_PX = 50;

	var game = new _Connect.Connect4();

	$(document).ready(function () {
	    new_game();
	    $('#new_game').click(new_game);
	});

	function process_click(e) {

	    var result;
	    var position;
	    position = get_position_clicked(e);

	    if (position.row == -1) {
	        $('.grid').one('click', process_click);
	        return;
	    }

	    //alert('col =' + position.column + ' row =' + position.row);

	    game.add_chip(game.current_player, position);
	    animate_chip_drop(game.current_player, position);

	    // TODO - could not get the transitioned event listener to work
	    // so delay 500 ms which is the animation duration
	    setTimeout(function () {
	        var id = '#c' + position.column + 'r' + position.row;
	        $(id).addClass('player' + game.current_player);

	        result = game.detect_win(game.current_player, position);

	        if (result.winning_moves.length > 0) {
	            end_game(game.current_player, result.winning_moves);
	            return;
	        }

	        toggle_player();
	        $('.grid').one('click', process_click);
	    }, ANIMATE_DURATION_MS + ANIMATE_DELAY_MS);
	}

	function animate_chip_drop(player, position) {

	    var target;
	    var colClass = 'c' + position.column;
	    var rowClass = 'r' + position.row;
	    var playerChipClass = 'p' + player + '-chip';

	    target = $('#animatechip');
	    target.show();
	    target.removeClass();

	    setTimeout(function () {

	        target.addClass(playerChipClass);
	        target.addClass(colClass);
	        target.addClass(rowClass);
	        target.addClass('chipSlideDown-' + rowClass);
	    }, ANIMATE_DELAY_MS);
	}

	function end_game(player, moves) {
	    // display winning moves
	    for (var i = 0; i < moves.length; i++) {
	        var move = moves[i];
	        var id = '#c' + move.column + 'r' + move.row;
	        $(id).addClass('win');
	    }

	    $('#whoisup').text('Player ' + player + '\'s Wins!');
	}

	function get_position_clicked(e) {

	    // TODO - need better way to handle 10px left padding
	    // such as getting the td id, but the blank.gif is being returned
	    // option: can put the id on the gif as well?
	    var x = e.pageX - LEFT_PADDING_PX;
	    var i = Math.floor(x / SQUARE_SIZE_PX);
	    var j = game.get_next_empty_slot(i);
	    return { column: i, row: j };
	}

	function new_game() {
	    reset_pieces();
	    game.reset();
	    display_player_up();
	    $('.grid').one('click', process_click);
	    $('#animatechip').hide();
	}

	function toggle_player() {
	    game.toggle_player();
	    display_player_up();
	}

	function display_player_up() {
	    var player = 'Player ' + game.current_player;
	    var target = $('#whoisup');

	    target.removeClass();
	    setTimeout(function () {
	        target.text(player + '\'s turn');
	        target.addClass('highlight-' + game.current_player);
	        target.addClass('slideDown');
	    }, 1);
	}

	function reset_pieces() {

	    for (var i = 0; i < _Connect.Connect4.info.MAX_COLUMNS; i++) {
	        for (var j = 0; j < _Connect.Connect4.info.MAX_ROWS; j++) {
	            var id = 'c' + i + 'r' + j;
	            document.getElementById(id).className = '.none';
	        }
	    }
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.assert = assert;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function assert(condition, message) {
	    if (!condition) {
	        var msg = message || "Assertion failed";
	        if (typeof Error !== "undefined") {
	            throw new Error(msg);
	        }
	        throw msg; // Fallback
	    }
	}

	var Connect4 = exports.Connect4 = function () {
	    _createClass(Connect4, null, [{
	        key: "info",
	        get: function get() {
	            return {
	                MAX_ROWS: 6,
	                MAX_COLUMNS: 7,
	                PLAYER1: 1,
	                PLAYER2: 2,
	                EMPTY: 0
	            };
	        }
	    }]);

	    function Connect4(initial_rack) {
	        _classCallCheck(this, Connect4);

	        this.winner = null;
	        this.last_move = null;
	        this.winning_moves = [];
	        this.reset();
	        this.current_player = Connect4.info.PLAYER1;

	        if (initial_rack) {
	            this.rack = initial_rack;
	        }
	    }

	    _createClass(Connect4, [{
	        key: "reset",
	        value: function reset() {

	            // array of columns, the top row below is the left side of the board
	            this.rack = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];

	            this.current_player = Connect4.info.PLAYER1;
	        }

	        // give a column i, returns the lowest empty row index
	        // return -1 if column is full

	    }, {
	        key: "get_next_empty_slot",
	        value: function get_next_empty_slot(i) {

	            var column = this.rack[i];
	            var j;

	            for (j = 0; j < Connect4.info.MAX_ROWS; j++) {
	                if (column[j] == Connect4.info.EMPTY) {
	                    return j;
	                }
	            }

	            return -1;
	        }
	    }, {
	        key: "add_chip",
	        value: function add_chip(player, position) {

	            assert(position.column < Connect4.info.MAX_COLUMNS && position.column >= 0);
	            assert(position.row < Connect4.info.MAX_ROWS && position.row >= 0, "MAX_ROWS exceeded.");
	            assert(this.rack[position.column][position.row] == Connect4.info.EMPTY, "Duplicate move.");
	            assert(position.row === 0 || this.rack[position.column][position.row - 1] != Connect4.info.EMPTY, "Illegal Move: mid air suspension of chip not allowed.");

	            this.rack[position.column][position.row] = player;
	            this.last_move = position;
	        }
	    }, {
	        key: "toggle_player",
	        value: function toggle_player() {

	            if (this.current_player == Connect4.info.PLAYER1) {
	                this.current_player = Connect4.info.PLAYER2;
	            } else {
	                this.current_player = Connect4.info.PLAYER1;
	            }
	        }
	    }, {
	        key: "detect_win",
	        value: function detect_win(player, position) {

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
	    }, {
	        key: "detect_horizontal_win",
	        value: function detect_horizontal_win(player, position) {

	            var contiguous_right = 0;
	            var contiguous_left = 0;
	            var moves = [position];

	            assert(this.rack[position.column][position.row] == player);

	            for (var i = position.column + 1; i < Connect4.info.MAX_COLUMNS; i++) {
	                if (this.rack[i][position.row] == player) {
	                    contiguous_right++;
	                    moves.push({ column: i, row: position.row });
	                } else {
	                    break;
	                }
	            }

	            for (var i = position.column - 1; i >= 0; i--) {
	                if (this.rack[i][position.row] == player) {
	                    contiguous_left++;
	                    moves.push({ column: i, row: position.row });
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
	    }, {
	        key: "detect_vertical_win",
	        value: function detect_vertical_win(player, position) {

	            // var contiguous_up = 0;
	            var contiguous_down = 0;
	            var moves = [position];

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

	            for (var j = position.row - 1; j >= 0; j--) {
	                if (this.rack[position.column][j] == player) {
	                    contiguous_down++;
	                    moves.push({ column: position.column, row: j });
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
	    }, {
	        key: "detect_diaganol_forward_win",
	        value: function detect_diaganol_forward_win(player, position) {

	            var contiguous_upright = 0;
	            var contiguous_downleft = 0;
	            var i = position.column + 1;
	            var j = position.row + 1;
	            var moves = [position];

	            assert(this.rack[position.column][position.row] == player);

	            while (i < Connect4.info.MAX_COLUMNS && j < Connect4.info.MAX_ROWS) {
	                if (this.rack[i][j] == player) {
	                    contiguous_upright++;
	                    moves.push({ column: i, row: j });
	                    i++;
	                    j++;
	                } else {
	                    break;
	                }
	            }

	            i = position.column - 1;
	            j = position.row - 1;
	            while (i >= 0 && j >= 0) {
	                if (this.rack[i][j] == player) {
	                    contiguous_downleft++;
	                    moves.push({ column: i, row: j });
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
	    }, {
	        key: "detect_diaganol_backward_win",
	        value: function detect_diaganol_backward_win(player, position) {

	            var contiguous_upleft = 0;
	            var contiguous_downright = 0;
	            var moves = [position];

	            assert(this.rack[position.column][position.row] == player);

	            var i = position.column - 1;
	            var j = position.row + 1;
	            while (i >= 0 && j < Connect4.info.MAX_ROWS) {
	                if (this.rack[i][j] == player) {
	                    contiguous_upleft++;
	                    moves.push({ column: i, row: j });
	                    i--;
	                    j++;
	                } else {
	                    break;
	                }
	            }

	            i = position.column + 1;
	            j = position.row - 1;
	            while (i < Connect4.info.MAX_COLUMNS && j >= 0) {
	                if (this.rack[i][j] == player) {
	                    contiguous_downright++;
	                    moves.push({ column: i, row: j });
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
	    }]);

	    return Connect4;
	}();

/***/ }
/******/ ]);