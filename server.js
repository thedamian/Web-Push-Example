/*

Server backend example for the Web Push Example repo on http://github.com/thedamian/web-push-example

This server has three purposes

1) Serve the html page that will have all the Javascript to setup the notification on the browser
2) Receive the token from each client and store it (right now in just a basic array)
3) Sending a notification to ALL clients that registered through their respective Urls
*/


// Setup the basics for a basic express server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000
var bodyParser = require("body-parser");
var server = http.createServer(app);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/"));
app.listen(port,function() { console.log("started on port " + port); });
//server.listen(port);
// express is setup for the basics

// Push notification setting up
// Push notification setting up
const webpush = require('web-push');
// VAPID keys should only be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();
var options = { gcmAPIKey: 'AAAAwuJ2G8o:APA91bG6whHaF0VY7NYzgE2fN8DE2YWfyMZ2jl0J3h-yhROkhWOIx8DVhmun9WkcSSQvNpZH6xheT7qIi8GlEHw_tV9IyaoKoR_gBaOuM57sR1UZp73VUmGm5sPdeZOBDuJnQxK4WSLq', TTL: 60};

webpush.setGCMAPIKey('AAAAwuJ2G8o:APA91bG6whHaF0VY7NYzgE2fN8DE2YWfyMZ2jl0J3h-yhROkhWOIx8DVhmun9WkcSSQvNpZH6xheT7qIi8GlEHw_tV9IyaoKoR_gBaOuM57sR1UZp73VUmGm5sPdeZOBDuJnQxK4WSLq');
webpush.setVapidDetails(
  'mailto:damian@bocajs.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
// Push notification setting up
// Push notification setting up


var tokenlist = [];


app.get('/notify',function(req,res) { 
// Let ALL browsers pop up a message
   console.log(" We've been notified. Now send notification to all browsers");
   for (var i=0;i < tokenlist.length;i++) {
       console.log("Notify token: " + tokenlist.token);
       // Code here.
       var payload = "Web Notification from BocaJS";
       var pushSubscription = {
        "endpoint":tokenlist.token,
        "keys": {
            "p256dh":tokenlist.token,
            "auth": tokenlist.auth
        }
    }
       webpush.sendNotification(pushSubscription,payload,options);

   }
});

app.post('/newbrowser',function(req,res){
    var token = req.query.token;
    var isSafari = (req.headers['user-agent'].indexOf("Safari") > 0);
    var auth = req.query.auth;
    var endpoint = req.query.endpoint;
    tokenlist.add({token:token,os:os,endpoint:endpoint});
    console.log("adding token: "+ token + " with isSafari: " + isSafari + " and notification url:" + endpoint);
});

