// 1) Ask for permissions. Handle if they say no.
Notification.requestPermission(
    function(status) {
        console.log('Notification Permissiong status:',status);
    });

//Hello world notification
var options = {
    body: "notification body",
    icon: 'icon.png',
    vibrate: [100,50,100,50],
    // allows us to identify notification
    data: {primaryKey: 1}
};
    function displayNotification() {
        if (Notification.permission === 'granted') {
            navigator.serviceWorker.getRegistration()
            .then(function(req) {
                req.showNotification("Hello world",options);
            })
        }
    }




var FancyOptions = {
  body: "notification body",
  actions: [
      {action:'explore', title: 'Go to the site', icon: 'icon.png'},
      {action:'close',title: 'No thanks',icon: 'icon.png'}
  ]

};



// test!
displayNotification();

//Service Worker Notification Events
self.addEventListener('notificationclose',
function(event) {
    var notification = event.notification;
    var primaryKey = notification.data.primaryKey;
    console.log("Closed Notification: ",primaryKey);
});

self.addEventListener('notificationclick',
function(event) {
    var notification = event.notification;
    var action = event.action;
    if (action === 'close') {
        notification.close();
    } else {
        clients.openWindow("http://bocajs.com");
    }
});

//actions in the FancyOptions
function explore() { alert("you clicked explore. How dare you!"); }
function close() { console.log('clicked closed'); }


// Listen to the push
self.addEventListener('push',function(e) {
  var title = e.data.text();
  e.waitUntil(
      self.getRegistration.showNotification(title)
  );
});


// Subscriptioin

navigator.serviceWorker.ready
.then(function(reg) {
    reg.pushManager.getSubscription()
    .then(function(sub) {
        if (sub == undefined) {
            // ask user to register for push
            console.log("ask user to register for push");
        } else {
            // you have a subscirption, updat the database on your server
            console.log(sub);
            console.log("Send subscriptioi to thserver");
        }
    })
});

navigator.serviceWorker.getRegistration() 
.then(function(reg) {
    reg.pushManager.subscribe({
        userVisibleOnly: true
    }). then (function (sub) {
        // send sub.toJSON() to server
        console.log(sub.toJSON());
         // body: JSON.stringify(fields)
        var fields = {endpoint:sub.endpoint,token:sub.keys.p256dh,auth:sub.keys.auth};

        fetch('/newbrowser', {
            method: 'POST',
            body: JSON.stringify(fields)
          }).then(function(response) {
            return response.json();
          }).then(function(data) {
            console.dir(data);
          });

        /*
            example:
            {
                "endpoint":"https:/android.googleapis.com/gcm/send/fasdfasdf....",
                "keys": {
                    p256dh":"blasdfklasjdflkajs-asdfasd...",
                    "auth": "alsdkfhlajsdhsfljadhsf=="
                }
            }
        */
    });
});