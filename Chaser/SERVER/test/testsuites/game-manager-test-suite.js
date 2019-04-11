const chai = require('chai');
const expect = chai.expect;
const mocha = require('mocha');
const it = mocha.it;
const describe = mocha.describe;
const before = mocha.before;
const after = mocha.after;

const GameManager = require('./../../server/GameManager');
const Game = require('./../../server/Game');
let gameManager = GameManager();
let games = [];

//const game = Game(0);
/**
 * Run the tests.
 */
module.exports = function run() {
	describe('GameManager test-suite', () => {
        before( () => {
            games.push(gameManager.addGame());
            games.push(gameManager.addGame());
        });

        after( () =>  {
            gameManager = null;
            games = [];
        });

        describe('addGame()', () => {
            it('should return new Game with incremented id', (done) => {
                expect(games[0].getGameId()).to.equal(games[1].getGameId()-1);
                done();
            });

            it('should have correct properties', (done) => {
                expect(games[0]).to.have.property('onGameOver');
                expect(games[0]).to.have.property('updateGameRound');
                expect(games[0]).to.have.property('getPlayers');
                expect(games[0]).to.have.property('addPlayer');
                expect(games[0]).to.have.property('getNoOfPlayers');
                expect(games[0]).to.have.property('getPlayerRole');
                done();
            });
        });

        describe('gamePending()', () => {
            it('should return false when no games are pending', (done) => {
                expect(gameManager.gamePending()).to.be.false;
                done();
            });

            it('should return true when a game is pending', (done) => {
                games.push(gameManager.addGame());
                games[games.length-1].addPlayer('Johan', {id: '0', emit: function(channel, winner) {}});
                expect(gameManager.gamePending()).to.be.true;
                done();
            });
            
        });

        describe('getGamePendingId()', () => {
            it('should return pending game id from sut', (done) => {
                expect(gameManager.getPendingGameId()).to.equal(games[games.length-1].getGameId());
                done();
            });
            
        });
        
        describe('getGame()', () => {
            it('should return undefined when id is less than 0', (done) => {
                expect(gameManager.getGame(-1)).to.be.undefined;
                done();
            });

            it('should return undefined when id is greater than number of games in gameManager', (done) => {
                expect(gameManager.getGame(games.lastIndexOf+1)).to.be.undefined;
                done();
            });
            
            it('should return a valid game when id is valid', (done) => {
                expect(gameManager.getGame(games.length - 1).getGameId()).to.equal(games[games.length - 1].getGameId());
                done();
            });
        });
        
    });
    
}
