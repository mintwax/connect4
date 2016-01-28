'use strict';

import { Connect4 } from './Connect4.js';

var ANIMATE_DELAY_MS = 10;
var ANIMATE_DURATION_MS = 500; // needs to match animation-duration in css
var LEFT_PADDING_PX = 10;
var SQUARE_SIZE_PX = 50;

var game = new Connect4();

$(document).ready(function(){
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
    setTimeout(function() {
        var id = '#c' + position.column + 'r' + position.row;
        $(id).addClass('player'+game.current_player);

        result = game.detect_win(game.current_player, position);

        if (result.winning_moves.length > 0) {
            end_game(game.current_player, result.winning_moves);
            return;
        }

        toggle_player();
        $('.grid').one('click', process_click);

    }, ANIMATE_DURATION_MS+ANIMATE_DELAY_MS);
}


function animate_chip_drop(player, position) {

    var target;
    var colClass = 'c' + position.column;
    var rowClass = 'r' + position.row;
    var playerChipClass = 'p' + player + '-chip';

    target = $('#animatechip');
    target.show();
    target.removeClass();

    setTimeout(function() {

        target.addClass(playerChipClass);
        target.addClass(colClass);
        target.addClass(rowClass);
        target.addClass('chipSlideDown-' + rowClass);

    }, ANIMATE_DELAY_MS);

}

function end_game(player, moves) {
    // display winning moves
    for (let i = 0; i < moves.length; i++) {
        let move = moves[i];
        let id = '#c' + move.column + 'r' + move.row;
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
    setTimeout(function(){
        target.text(player + '\'s turn');
        target.addClass('highlight-' + game.current_player);
        target.addClass('slideDown');
    }, 1);
}

function reset_pieces() {

    for (let i = 0; i < Connect4.info.MAX_COLUMNS; i++) {
        for (let j = 0; j < Connect4.info.MAX_ROWS; j++) {
            let id = 'c' + i + 'r' + j;
            document.getElementById(id).className = '.none';
        }
    }
}
