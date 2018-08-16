var mysql      = require('mysql');
const config = require('./config');
var express    = require("express");
var app = express();
var router = express.Router();
var connection = mysql.createConnection(config);

connection.query('CREATE DATABASE IF NOT EXISTS user_orders', function (err) {
    if (err) {
        console.log("Database Creation Error");
    }
    else {
        connection.query('USE user_orders', function (err) {
            if (err){
                console.log("Using database Error");
            }
            else {
                connection.query('create table if not exists imagedata(user int NOT NULL DEFAULT \'0\', image LONGTEXT NOT NULL);', function (err) {
                    if (err){
                        console.log("Table Already Existed");
                    }
                    else {
                        console.log("Successfully Connected to Database")
                    }
                });
            }
        });
    }
});
router.get('/',function (req,res) {
    console.log("Heree-----");
});
router.post('/InsertImage',function (req,res) {
    if(req.body.obj){
        var obj =(req.body.obj).replace(/^data:image\/[a-z]+;base64,/, "");
        var values = [[2,obj]];
        var sql = "INSERT INTO imagedata (user, image) VALUES ?";
        connection.query(sql,[values], function (err, result) {

            if (err){res.status(500).send()}
            else {
                console.log("Number of records inserted: " + result.affectedRows);
                res.send("Inserted")
            }
        });
    }
});
router.get('/getAllDesigns',function (req,res) {
    connection.query('SELECT * from imagedata where user=2', function(err, rows, fields) {
        if (!err){
        res.send(rows);
        }
    else {
            console.log('Error while performing Query.');
            res.status(500).send()
        }
    });
});
module.exports =router;