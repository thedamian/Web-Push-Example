/*

Server backend example for the Web Push Example repo on http://github.com/thedamian/web-push-example

This server has three purposes

1) Serve the html page that will have all the Javascript to setup the notification on the browser
2) Receive the token from each client and store it (right now in just a basic array)
3) Sending a notification to ALL clients that registered through their respective Urls
*/


// Setup the basics for a basic express server
const express = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 5004
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // I prefer EJS because it reminds me of home
app.set("views", __dirname + `/views`); // the .ejs file live in the /views directory
app.use(express.static(__dirname + "/public")); // anything you ask from the root is coming from the /public



// Push notification setting up
// Push notification setting up
const webpush = require('web-push'); // web push library that helps us with encryption to packats
const vapidKeys = webpush.generateVAPIDKeys() // let's get some brand new private and public keys. 
const vapidPublicKey = vapidKeys.publicKey;
const vapidPrivateKey = vapidKeys.privateKey;
// console.log("Vapid keys",vapidPublicKey,vapidPrivateKey); // if you want to depub

webpush.setVapidDetails(
  'mailto:damian@floridajs.com',  // you can change it in your project or else everyone blames me for your notifications!
  vapidPublicKey,  // Public key first
  vapidPrivateKey  // Private key second
);
// Push notification setting up
// Push notification setting up



// hitting the root website. Ok. I'll give you the contents of index.ejs
app.get("/",(req,res) => {
   res.render("index.ejs",{vapidPublicKey:vapidPublicKey}); // pass the public key to the front end for it's javascript 
});

let tokenlist = []; // keep trick of all the browser payloads as "tokens"

// This get's called when a new browser registers itself. We save it in the tokenList array.
app.post('/newbrowser',function(req,res){
    var token = req.body.token;
    var isSafari = (req.headers['user-agent'].indexOf("Safari") > 0);
    var auth = req.body.auth;
    var endpoint = req.body.endpoint;
    tokenlist.push({token:token,auth:auth,isSafari:isSafari,endpoint:endpoint});
    console.log("adding token: "+ token + " with auth: " + auth + " and notification url:" + endpoint);
    res.json({success:true});
});


// someone has asked to notify everyone. (i.e. someone went to the /notify website) Remember: You asked for it. 
app.get('/notify',function(req,res) {    
   var options = {
       TTL: 24 * 60 * 60,
       vapidDetails: {
         subject: 'mailto:damian@floridajs.com',
         publicKey: vapidPublicKey,
         privateKey: vapidPrivateKey
       }
   };
   var message = "Web Notification from FloridaJS! Yeaheee!!!!";
   const payload = JSON.stringify({ title: "Hello World", body: "This is your first push notification" });
       
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
       try {
	 webpush.sendNotification(pushSubscription,payload); // ,options);
          console.log("Notification successful");
       } catch(ex) { 
	  console.error("error in sendNotification)",ex);
       }
   }
   
   console.log(tokenlist.length + " notification sent");
   
   res.end( tokenlist.length + " notification sent");
   
});


app.listen(port,function() { console.log("started on port " + port); });
