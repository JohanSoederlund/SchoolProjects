const chai = require('chai');
const expect = chai.expect;
const mocha = require('mocha');
const it = mocha.it;
const describe = mocha.describe;
const before = mocha.before;
const after = mocha.after;

const User = require('./../../../database/models/User');

/**
 * Run the tests.
 */
module.exports = function run() {
	describe('User model test suite', () => {
        before( () => {
        });

        after( () =>  {
        });

        describe('new User()', () => {
            it('should throw error if userName is missing', (done) => {
                let user = new User({password: 'KJHsadh223'});
                user.validate((err) => {
					expect(err).to.be.exist;
					done();
				});
            });

            it('should throw error if password is missing', (done) => {
                let user = new User({userName: 'Steve Jobs'});
                user.validate((err) => {
					expect(err).to.be.exist;
					done();
				});
            });

            it('should create a valid user', (done) => {
                let user = new User({userName: 'Steve Jobs', password: 'KJHsadh223'});
                user.validate((err) => {
                    expect(err).to.be.null;
                    let id = user._id;
                    expect(JSON.stringify(user)).to.equal(JSON.stringify({_id: id, userName: 'Steve Jobs', password: 'KJHsadh223'}));
                    done();
				});
            });
        });

    });

}