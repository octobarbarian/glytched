// thanks to https://github.com/borismus/osmus for this hack
(function (exports) {

    exports.newPlayer = function () {
        var p = new Object();
        p.id = Math.random().toString(36).substring(2, 10);
        p.x = 0;
        p.y = 0;
        p.face = 'soul';
        p.glitches = new Array();
        return p;
    };

    exports.newGame = function () {
        var game = new Object();

        game.TILE_PIXEL_WIDTH = 16;
        game.TILE_PIXEL_HEIGHT = 16;
        game.MAP_WIDTH = 15;
        game.MAP_HEIGHT = 9;

        game.faces = new Array();
        game.faces.push('flower');
        game.faces.push('egg');
        game.faces.push('mouse');
        game.faces.push('hammer');
        game.faces.push('teapot');
        game.faces.push('jellyfish');
        game.faces.push('duck');
        game.faces.push('log');
        game.faces.push('pants');
        game.faces.push('umbrella');

        game.map = new Array(game.MAP_WIDTH);
        for (var x = 0; x < game.MAP_WIDTH; x++) {
            game.map[x] = new Array(game.MAP_HEIGHT);
            for (var y = 0; y < game.MAP_HEIGHT; y++) {
                game.map[x][y] = 30; // grass by default
                if (x < y * 2 - 6) { game.map[x][y] = 32; } // dirt
                if (x > 11 && y >= 2 && y <= 4 || (x === 11 && y === 3)) { game.map[x][y] = 34; } // stone
                if (y === 0) { game.map[x][y] = 36; } // sky
                if ((y === 7 && x > 7) || (y === 8 && x > 5)) { game.map[x][y] = 31; } // water
                if ((y === 6 && x > 5) || (y === 7 && x > 3 && x <= 7) || (y === 8 && x > 2 && x <= 5)) { game.map[x][y] = 37; } // sand

            }
        }

        game.players = {};

        game.monolith = new Object();
        game.monolith.x = game.TILE_PIXEL_WIDTH * 13;
        game.monolith.y = game.TILE_PIXEL_HEIGHT * 3;

        return game;
    }

})(typeof global === 'undefined' ? window : exports);