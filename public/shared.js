// thanks to https://github.com/borismus/osmus for this hack
(function (exports) {

    exports.newPlayer = function () {
        var p = new Object();
        p.id = Math.random().toString(36).substring(2, 10);
        p.dispX = 0;
        p.dispY = 0;
        p.goalX = 0;
        p.goalY = 0;
        p.anim = null;
        p.face = 'soul';
        return p;
    };

    exports.newGame = function () {
        var game = new Object();

        game.TILE_PIXEL_WIDTH = 16;
        game.TILE_PIXEL_HEIGHT = 16;
        game.MAP_WIDTH = 20;
        game.MAP_HEIGHT = 20;

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