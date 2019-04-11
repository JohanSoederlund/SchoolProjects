/**
 * Runs all test-suites.
 */

// Variables
const chai = require('chai');
const expect = chai.expect;
const mocha = require('mocha');
const it = mocha.it;
const describe = mocha.describe;
const before = mocha.before;
const after = mocha.after;

//SERVER
const gameTests = require('./testsuites/game-test-suite');
const gameManagerTests = require('./testsuites/game-manager-test-suite');
const handlersTests = require('./testsuites/handlers-test-suite');
const clientManagerTests = require('./testsuites/client-manager-test-suite');

//DB
const userTests = require('./testsuites/database/user-test-suite');
const databaseHandlerTests = require('./testsuites/database/databasehandler-test-suite');

/*
//Test the Testrunner
describe('Testrunner', () => {
	it('should return pass on 1 + 1 equals 2', (done) => {
		expect(1 + 1).to.equal(2);
		done();
	});
});
*/

/*********************************************/
/* 					Run suites				 */ 
/*********************************************/
clientManagerTests();
gameTests();
gameManagerTests();
handlersTests();
userTests();
databaseHandlerTests();

