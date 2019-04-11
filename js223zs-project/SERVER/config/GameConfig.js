
module.exports = function() {
    let gamePieces = {
        maxDetectives: 5, 
        maxCCTV: 2, 
        maxRoadBlocks: 1, 
        maxRunners: 1, 
    }

    function getGamePieces() {
        return gamePieces;
    }

    function setGamePieces(key, value) {
        gamePieces[key] = value;
    }

    return {
        getGamePieces,
        setGamePieces
    }

} 