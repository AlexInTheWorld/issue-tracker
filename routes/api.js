/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const projectSchema = require('./projects.js')

// Set connection to DB:
mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Routing
module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      var Projectcollection = mongoose.model(project, projectSchema);

      // Retrieve all documents from the project
      var docs = Projectcollection.find(req.query, (err, foundArr) => {
        if (err) { return res.redirect("/") }
        res.json(foundArr);
      })
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      var creation_date = new Date(Date.now());
      
      var Projectcollection = mongoose.model(project, projectSchema);

      var newID = new ObjectId;
      var newProjectDoc = new Projectcollection({
        _id: newID,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        created_on: creation_date.toISOString(),
        updated_on: creation_date.toISOString(),
        open: true,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text
      });
     
      newProjectDoc.save(function(err, savedProject) {
        if (err) { return res.redirect(204, "/") }
        res.status(200).json([savedProject]);
        
      });
      
    })
    
    .put(function (req, res){
      var project = req.params.project;

      // Make object with the parameters sent by the client to be updated on the specified by id issue
      var new_params = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text
      }

      // Remove empty properties => blank fields won't change existing corresponding data
      for (let key in new_params) {
        if (!new_params[key]) {
          delete new_params[key]
        }
      }
      
      // Update data in DB accordingly:
      //::: empty data => no update
      //::: fields to update => launch request to find doc and update
      var new_params_arr = Object.keys(new_params);
      
      if (new_params_arr.length === 0) {
        console.log("No body. The response will encompass the text: no updated field sent");
        res.send("no updated field sent")

      } else {
        new_params.updated_on = new Date(Date.now()).toISOString();

        var Projectcollection = mongoose.model(project, projectSchema);
      
        Projectcollection.findOneAndUpdate({_id: req.body._id}, new_params, (err, success) => {
          if (err || !success) { 
            res.send(`could not update ${req.body._id}`)
          } else {
            res.send("successfully updated")
          }
        })
      }
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      var Projectcollection = mongoose.model(project, projectSchema);
      
      var id = req.body._id;
      if(id) {
        Projectcollection.deleteOne({_id: id}, (err, mongooseDeleteResult) => {
          if (err) {
            res.send(`could not delete ${id}`)
          } else {
            res.send(`deleted ${id}`)
          }
        })
      } else {
        res.send("id error")
      }
      
    });
    
};
