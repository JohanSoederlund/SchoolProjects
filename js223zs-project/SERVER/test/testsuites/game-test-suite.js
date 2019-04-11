const chai = require('chai');
const expect = chai.expect;
const mocha = require('mocha');
const it = mocha.it;
const describe = mocha.describe;
const before = mocha.before;
const after = mocha.after;

const Game = require('./../../server/Game');
let game = new Game(0);

/**
 * Run the tests.
 */
module.exports = function run() {
	describe('Game test-suite', () => {
        before( () => {
            //game = new Game(0);
        });

        after( () =>  {
            game = null;
        });

        describe('Game properties', () => {
            it('should have correct properties', (done) => {
                expect(game).to.have.property('onGameOver');
                expect(game).to.have.property('updateGameRound');
                expect(game).to.have.property('getPlayers');
                expect(game).to.have.property('addPlayer');
                expect(game).to.have.property('getNoOfPlayers');
                expect(game).to.have.property('getPlayerRole');
                done();
            });
        });

        describe('addPlayer()', () => {
            it('should return expected player role', (done) => {
                let expected = 'Chaser';
                //const player = mockPlayers(0);
                let result = game.addPlayer(player0, client0);
                expect(result).to.equal(expected);
                done();
            });
        });

        describe('getPlayerRole', () => {
            it('should return correct player role', (done) => {
                let expected = 'Chaser';
                let result = game.getPlayerRole(client0);
                expect(result).to.equal(expected);
                done();
            });
        });

        describe('getNoOfPlayers', () => {
            it('should return number of players', (done) => {
                let result = game.getNoOfPlayers();
                expect(result).to.equal(1);
                done();
            });
        });

        describe('getGameId', () => {
            it('should return game id', (done) => {
                let expected = 0;
                let result = game.getGameId();
                expect(result).to.equal(expected);
                done();
            });
        });

        describe('getPlayers', () => {
            it('should return deep copy of mockdata', (done) => {
                game.addPlayer(player1, client1);
                expect(JSON.stringify(game.getPlayers())).to.equal(JSON.stringify(mockPlayers()));
                done();
            });
        });
/*
        describe('updateGameRound', () => {
            it('should', (done) => {
            
            });
        });

        

        describe('onGameOver', () => {
            it('should', (done) => {
            
            });
        });
        */
    });
}

/**
 * helpers
 */
const client0 = {id: 0, emit: function(channel, winner){}};
const client1 = {id: 1, emit: function(channel, winner){}};
const player0 = 'Johan';
const player1 = 'Martin';

function mockPlayers() {
    return [{id: client0.id, role: 'Chaser', name: player0},{id: client1.id, role: 'Runaway', name: player1}];
};
