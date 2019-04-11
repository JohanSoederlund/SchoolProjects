const chai = require('chai');
const expect = chai.expect;
const mocha = require('mocha');
const it = mocha.it;
const describe = mocha.describe;
const before = mocha.before;
const after = mocha.after;

const sinon = require('sinon');
const spy = sinon.spy;
const mongoose = require('mongoose');

const DBConnection = require('./../../../database/DBConnection');

const sut = new DBConnection();
const correctConnectionString = 'mongodb://127.0.0.1:27017';
const incorrectConnectionString = 'mongodb://127.0.0.1:27018';

var db = mongoose.connection;

/**
 * Run the tests.
 */
module.exports = function run() {
	describe('Database connection test suite', () => {
        after(() => {
			return new Promise((resolve) => {
				mongoose.connection.close(resolve);
			});
		});

        describe('connect()', () => {
            
            before(() => {
                return new Promise((resolve) => {
                    db.on('ready', spy);
                    db.on('ready', resolve);
                    //sut.on('ready', spy);
                    //sut.on('ready', resolve);
                    //sut.connect(correctConnectionString);
                });
            });
            

            beforeEach(() => {
                sinon.stub(console, 'log');
              });

            after(() => {
                return new Promise((resolve) => {
                    mongoose.connection.close(resolve);
                    db.removeListener('ready', spy);
                    db.removeListener('ready', resolve);
                    //sut.removeListener('ready', spy);
                    //sut.removeListener('ready', resolve);
                });
            });

            it('should log open', () => {
                sut.connect(correctConnectionString)
                    .then(() => {
                        done();
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                    //expect(spy.called).to.equal(true);
                /*
                expect(spy.called).to.equal(true);
                expect( console.log.calledOnce ).to.be.true;
                expect( console.log.calledWith('db ready: connected') ).to.be.true;
                */
            });

            it('should log disconnect', () => {
                
            });
        });

    });

}
