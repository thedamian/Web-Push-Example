/*

Server backend example for the Web Push Example repo on http://github.com/thedamian/web-push-example

This server has three purposes

1) Serve the html page that will have all the Javascript to setup the notification on the browser
2) Receive the token from each client and store it (right now in just a basic array)
3) Sending a notification to ALL clients that registered through their respective Urls
*/


// Setup the basics for a basic express server
//var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000
var bodyParser = require("body-parser");
//var server = http.createServer(app);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/"));
app.listen(port,function() { console.log("started on port " + port); });
//server.listen(port);
// express is setup for the basics

// Push notification setting up
// Push notification setting up
const webpush = require('web-push');
// VAPID keys should only be generated only once. we've run the vapid.js file to do this.
var vapidPublicKey = "-- YOUR VAPID public key here --";
var vapidPrivateKey = "-- YOUR VAPID private key here --"

webpush.setVapidDetails(
  'mailto:damian@bocajs.org',
  vapidPublicKey,
  vapidPrivateKey
);
// Push notification setting up
// Push notification setting up


var tokenlist = [];



app.post('/newbrowser',function(req,res){
    var token = req.body.token;
    var isSafari = (req.headers['user-agent'].indexOf("Safari") > 0);
    var auth = req.body.auth;
    var endpoint = req.body.endpoint;
    tokenlist.push({token:token,auth:auth,isSafari:isSafari,endpoint:endpoint});
    console.log("adding token: "+ token + " with auth: " + auth + " and notification url:" + endpoint);
    res.end("ok");
});






app.get('/notify',function(req,res) { 
// Let ALL browsers pop up a message
  // console.log(" We've been notified. Now send notification to all browsers");
   
   var options = {
       TTL: 24 * 60 * 60,
       vapidDetails: {
         subject: 'mailto:damian@bocajs.com',
         publicKey: vapidPublicKey,
         privateKey: vapidPrivateKey
       }
   };
   var message = "Web Notification from BocaJS";
       
   // Hit each browser that registered with us.
   for (var i=0;i < tokenlist.length;i++) {
       // Code here.
       let pushSubscription = {
        "endpoint":tokenlist[i].endpoint,
        "keys": {
            "p256dh":tokenlist[i].token,
            "auth": tokenlist[i].auth
            } // end keys
       }; // end pushSubscription 
       
       // MAGIC!
       webpush.sendNotification(pushSubscription,message,options);
   }
   
   console.log(tokenlist.length + " notification sent");
   
   res.end( tokenlist.length + " notification sent");
   
});


