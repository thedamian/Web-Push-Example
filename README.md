# Web-Push-Example
A simple example of a Web Push Notification website and backend.

# Steps to build on your box.
1) run ```node vapid.js``` (get your own private & public keys needed)
2) edit the ```server.js``` file and replace the ```-- YOUR VAPID public key here --``` and ```private``` values
3) edit the ```index.html``` and put the public key in the ```-- YOUR VAPID public key here --``` value
4) run ```npm install```
5) now run```npm start```
6) browse to http://localhost:5000  and agree to receive notications (You can navigate to your computers IP from a phone or other device to get notifications there also)

# Send notifications
You need a "server side" a way to "SEND NOTIFICATIONS" 
you do that by simply navigating over to: ```http://localhost:5000/notify``` which will send the notification to your other window. (or if you close it will pop up a notifice message on the right of your computer or top or your phone.

See slides and presentation from my talk at the South Florida Code Camp Conference and the BocaJS Developer Group
https://docs.google.com/presentation/d/1-pkdU-Ol26OpuISnqPzFne5LW7flGOMWYxIw9HrlIqQ
