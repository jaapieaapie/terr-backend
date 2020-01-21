//'use strict'

const express = require("express");
const mysql = require("mysql");
const request = require("request");
var bodyParser = require('body-parser')
const fs = require("fs");
const admin = require("firebase-admin");

const serviceAccount = require("./terr-34f01-firebase-adminsdk-grfp8-e061f261bd.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://terr-34f01.firebaseio.com"
  });







const con = mysql.createConnection({
    host: "localhost",
    user: "jaap",
    password: "1Pokemon",
    database: "terr"
});

const app = new express();

var jsonParser = bodyParser.json()


app.listen(2121);

app.post("/report", jsonParser, (req, res) => {



        let lat = req.body.lat;
        let lon = req.body.lon;
        let text = req.body.text;
        console.log(req.body)
        con.query(`INSERT INTO reports (lat, lon, text) VALUES (${lat}, ${lon}, '${text || "none"}')`);
        res.status(200).send(`Report complete`)
        setTimeout(function() {
            sendAlert(lat, lon, text);
        }, 5000)

    

    
});


function sendAlert(lat, lon, text) {
    
    //OKe JonGEns rAF IS
    con.query(`SELECT * FROM tokens`, function(err, rows) {
        if(err) throw err;

        var tokens = [];

        rows.forEach(r => {
            tokens.push(r.token);
        });

        var message = {
            notification: {
              title: 'Alert',
              body: text || "No description"
            },
            tokens: tokens,
            android_channel_id: "main",
            android: {
                notification: {
                    title: 'Alert',
                    body: text || "No description",
                    channelId: "main",
                    defaultSound: true
                }
            }
        };

        admin.messaging().sendMulticast(message)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });
    })
}

console.log("ok")

app.post(`/token`,jsonParser ,function(req, res) {
    let token = req.body.token;
    console.log(token)
    con.query(`INSERT INTO tokens (token) VALUES ('${token}')`);
    res.send("OK");
})

app.get("/ping", function(req, res) {
    res.send("Pong")
})
/*oega boega hehehhehehe weet je wat ook iedieal is aan roterdam dat je gewoon je pan bami naar beneden kan pleuren heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee*/