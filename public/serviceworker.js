// serviceworker.js
// The serviceworker context can respond to 'push' events and trigger
// notifications on the registration property

// Listen to notification and SHOW a notification popup
self.addEventListener("push", (event) => {
  const data = e.data.json();
  let title = data.title || "a default message if nothing was passed to us";
  let body = data.body || "WOW! The things I learned at FloridaJS";
  let tag = data.tag  || "push-simple-demo-notification-tag";
  let icon = 'https://floridajs.com/images/logo.jpg';

  event.waitUntil(
    self.registration.showNotification(title, { body, icon, tag })
  )
});



self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  let clickResponsePromise = Promise.resolve();
    clickResponsePromise = clients.openWindow("https://github.com/thedamian/Web-Push-Example");

  event.waitUntil(
    Promise.all([
      clickResponsePromise,
      self.analytics.trackEvent('notification-click'),
    ])
  );
});



self.addEventListener('notificationclose', function(event) {
  event.waitUntil(
    Promise.all([
      self.analytics.trackEvent('notification-close'),
    ])
  );
});