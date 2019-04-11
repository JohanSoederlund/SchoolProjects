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
var stringHash = require("string-hash")

const DatabaseHandler = require('./../../../database/DatabaseHandler');
const DBConnection = require('./../../../database/DBConnection');

const DBConnectionInstance = new DBConnection();
const sut = new DatabaseHandler(DBConnectionInstance);
const correctConnectionString = 'mongodb://127.0.0.1:27017';

/**
 * Run the tests.
 */
module.exports = function run() {
	describe('Database handler test suite', () => {
        after(() => {
			return new Promise((resolve) => {
				mongoose.connection.close(resolve);
			});
		});

        before(() => {
			return new Promise((resolve, reject) => {
                sut.connect(correctConnectionString)
                    .then(() => {
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
			});
		});


        /*
		describe('connect()', () => {
			it('should connect the database', () => {
				return new Promise((resolve) => {

                    sut.connect(correctConnectionString)
                        .then(() => {
                            mongoose.connection.on('ready', spy);
                            expect(spy.called).to.equal(true);
                            
                            expect(mongoose.connection).to.be.true;
                            done();
                        })
                        .catch((error) => {
                            console.error(error);
                            //console.log(WEBGL_debug_renderer_info);
                        });
                    
                        
                    //sut.on('ready', resolve);
					//const spy = sinon.spy(DBConnectionInstance, 'connect');
					//sut.connect(correctConnectionString);
                    //expect(spy.called).to.equal(true);
				});
			});
        });
        */

        describe('add()', () => {
            it('should add user to db', (done) => {
                sut.add('user', {userName: 'Nils', password: 'asd123S'})
                    .then((saved) => {
                        expect(saved._id).to.exist;
                        expect(saved.userName).to.be.equal('Nils');
                        expect(saved.password).to.be.equal('asd123S');
                    })
                    .catch((error) => {
                        expect(error).to.not.exist;
                    });
                done();
            });
        });

        describe('getOne()', () => {
            it('should get sut user from db', (done) => {
                sut.getOne('user', {userName: 'Nils', password: 'asd123S'})
                    .then((result) => {
                        expect(result._id).to.exist;
                        expect(result.userName).to.be.equal('Nils');
                        expect(result.password).to.be.equal('asd123S');
                    })
                    .catch((error) => {
                        expect(error).to.not.exist;
                    });
                done();
            });
        });

        describe('removeOne()', () => {
            it('should remove sut user from db', (done) => {
                sut.removeOne('user', {userName: 'Nils', password: 'asd123S'})
                    .then((result) => {
                        expect(result._id).to.exist;
                        expect(result.userName).to.be.equal('Nils');
                        expect(result.password).to.be.equal('asd123S');
                    })
                    .catch((error) => {
                        expect(error).to.not.exist;
                    });
                done();
            });
        });

        describe('getOne()', () => {
            it('should not find sut user in db', (done) => {
                sut.getOne('user', {userName: 'Nils', password: 'asd123S'})
                    .then((result) => {
                        expect(result).to.be.null;
                        /*
                        expect(result._id).to.not.exist;
                        expect(result.userName).to.not.exist;
                        expect(result.password).to.not.exist;
                        */
                    })
                    .catch((error) => {
                        console.error(error);
                        expect(error).to.exist;
                        //expect(error).to
                    });
                done();
            });
        });

        //todo: getAll
		//todo: removeAll
    });

}
