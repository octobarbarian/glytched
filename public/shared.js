// thanks to https://github.com/borismus/osmus for this hack
(function (exports) {

    var GRID_WIDTH = 16;
    var GRID_HEIGHT = 16;

    var theGrid = new Array(GRID_WIDTH);
    for (var x = 0; x < GRID_WIDTH; x++) {
        theGrid[x] = new Array(GRID_HEIGHT);
        for (var y = 0; y < GRID_HEIGHT; y++) {
            theGrid[x][y] = 5; // white
        }
    }

    exports.GRID_WIDTH = GRID_WIDTH;
    exports.GRID_HEIGHT = GRID_HEIGHT;
    exports.theGrid = theGrid;

})(typeof global === 'undefined' ? window : exports);