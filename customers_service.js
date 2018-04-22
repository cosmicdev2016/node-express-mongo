var express = require('express'),
    bodyParser = require('body-parser');

var app = express();
var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.get('/listUsers', function (req, res) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("customers").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result.length + " objects found");
            res.end(JSON.stringify(result));
            db.close();
        });
    });
});

app.put('/editUser', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myquery = req.body[0];
        var newvalues = { $set: req.body[1] };
        dbo.collection("customers").updateOne(myquery, newvalues, function (err, result) {
            if (err) throw err;
            console.log("1 document updated");
            res.end(JSON.stringify(result));
            db.close();
        });
    });



});

app.post('/addUser', function (req, res) {
  
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");

        dbo.collection("customers").insertOne(req.body, function (err, result) {
            if (err) throw err;
            console.log("1 document inserted");
            res.end(JSON.stringify(result));
            db.close();
        });
    });



});

app.delete('/deleteUser/:name', function (req, res) {
    // req.params.name
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        console.log(req.params.name)
        var myquery = { "name": req.params.name};
        dbo.collection("customers").deleteOne(myquery, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            res.end(JSON.stringify(obj));
            db.close();
        });
    });
})

var server = app.listen(8081, function () {
    console.log("listening..");
})