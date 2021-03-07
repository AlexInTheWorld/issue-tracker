/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let testID; // to be used in PUT requests
    suite('POST /api/issues/{project} => object with issue data', function() {
       
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body[0].issue_title, 'Title');
          assert.strictEqual(res.body[0].issue_text, 'text');
          assert.strictEqual(res.body[0].created_by, 'Functional Test - Every field filled in')
          assert.strictEqual(res.body[0].assigned_to, 'Chai and Mocha');
          assert.strictEqual(res.body[0].status_text, 'In QA');
          // Update testID with the ID provided in the response to the post request        
          testID = res.body[0]._id;
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every required field filled in'
        })
        .end(function(err, res) {
          assert.isOk(res.body[0].issue_title, "title field is void");
          assert.isOk(res.body[0].issue_text, "text field is void");
          assert.isOk(res.body[0].created_by, "created_by field is void");
          done();
        });

      });
      
      test('Missing required fields', function(done) {
       chai.request(server)
        .post('/api/issues/test') 
        .send({
          issue_title: 'Title2',
          issue_text: 'created_by field missing'
        })
        .end(function(err, res) {
          // http status code 204: No Content: no additional content sent in the response payload body
          assert.equal(res.status, 204)
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
       chai.request(server)
        .put('/api/issues/test') 
        .send({
          _id: testID
        })
        .end(function(err, res) {
          assert.equal(res.text, 'no updated field sent')
          done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test') 
        .send({
          _id: testID,
          issue_title: 'an updated issue title'
        })
        .end(function(err, res) {
          assert.equal(res.text, 'successfully updated')
          done();
        });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test') 
        .send({
          _id: testID,
          issue_title: 'an updated issue title, second time',
          issue_text: 'the text is updated too'
        })
        .end(function(err, res) {
          assert.equal(res.text, 'successfully updated')
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_text: 'the text is updated too'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.propertyVal(res.body[0], 'issue_text', 'the text is updated too');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.propertyVal(res.body[0], 'issue_title', 'an updated issue title, second time');
          assert.propertyVal(res.body[0], 'issue_text', 'the text is updated too');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.propertyVal(res.body[0], 'created_by', 'Functional Test - Every field filled in');
          assert.propertyVal(res.body[0], 'assigned_to', 'Chai and Mocha');
          assert.propertyVal(res.body[0], 'open', true);
          assert.propertyVal(res.body[0],'status_text', 'In QA');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
         .delete('/api/issues/test')
         .send({})
         .end(function(err, res) {
           assert.equal(res.text, 'id error');
           done();
         })
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
         .delete('/api/issues/test')
         .send({_id: testID})
         .end(function(err, res) {
           assert.equal(res.text, `deleted ${testID}`);
           done();
         })
      });
      
    });

});
