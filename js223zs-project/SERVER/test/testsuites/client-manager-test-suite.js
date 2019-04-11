const chai = require('chai');
const expect = chai.expect;
const mocha = require('mocha');
const it = mocha.it;
const describe = mocha.describe;
const before = mocha.before;
const after = mocha.after;

const ClientManager = require('./../../server/ClientManager');
let clientManager = ClientManager();
let client1 = {id: "1234", info: "client1-1"};
let client2 = {id: "4567", info: "client2-1"};
let user1 = "TEST_AAA";
let user2 = "TEST_BBB";


/**
 * Run the tests.
 */

module.exports = function run() {
	describe('Client manager test-suite', () => {
        before( () => {
        });

        after( () =>  {
        });

        describe('addClient() and getClient()', () => {
            it('should be possible add client', (done) => {
                clientManager.addClient(client1);
                let client = clientManager.getClient(client1.id);
                expect(client).to.equal(client1);
                expect(client).to.have.property('info');
                done();
            });

            
            it('should be possible to update client', (done) => {
                client1.info = "updated";
                clientManager.addClient(client1);
                let client = clientManager.getClient(client1.id);
                expect(client1.info).to.equal("updated");
                done();
            });

            it('should be possible add another client', (done) => {
                clientManager.addClient(client2);
                let client_1 = clientManager.getClient(client1.id);
                let client_2 = clientManager.getClient(client2.id);
                expect(client_1).to.equal(client1);
                expect(client_1).to.have.property('info');
                expect(client_2).to.equal(client2);
                expect(client_2).to.have.property('info');
                expect(client_2.info).to.equal(client2.info);
                done();
            });

            it('client should be removed after disconnect', (done) => {
                expect(clientManager.removeClient(client1));
                expect(clientManager.getClient(client1.id)).to.be.undefined;
                done();
            });                  
        });        

        describe('userLoggedIn() and isUserLoggedIn()', ()  => {        
            it('user should not be logged in', (done) => {
                expect(clientManager.isUserLoggedIn(user1)).to.equal(false);
                done();
            });

            it('user should be able to login', (done) => {
                expect(clientManager.userLoggedIn(client1, user1)).to.equal(true);
                expect(clientManager.isUserLoggedIn(user1)).to.equal(true);
                done();
            });

            it('user should not be able to login when already loggedin', (done) => {
                expect(clientManager.userLoggedIn(client1, user1)).to.equal(false);
                expect(clientManager.isUserLoggedIn(user1)).to.equal(true);
                done();
            });   

            it('user should not be logged in after disconnect', (done) => {
                expect(clientManager.removeClient(client1));
                expect(clientManager.isUserLoggedIn(user1)).to.equal(false);
                done();
            });            
        });

    });
}

