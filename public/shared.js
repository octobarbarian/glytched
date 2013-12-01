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
        game.MAP_WIDTH = 20;
        game.MAP_HEIGHT = 20;

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
                game.map[x][y] = 30; // grass
            }
        }

        game.players = {};
        return game;
    }

})(typeof global === 'undefined' ? window : exports);