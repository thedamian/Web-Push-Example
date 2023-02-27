// serviceworker.js
// The serviceworker context can respond to 'push' events and trigger
// notifications on the registration property

// Listen to notification and SHOW a notification popup
self.addEventListener("push", (event) => {
  let title = (event.data && event.data.text()) || "a default message if nothing was passed to us";
  let body = "We have received a push message";
  let tag = "push-simple-demo-notification-tag";
  let icon = '/icon.png';

  event.waitUntil(
    self.registration.showNotification(title, { body, icon, tag })
  )
});



self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  let clickResponsePromise = Promise.resolve();
    clickResponsePromise = clients.openWindow("https://github.com/thedamian/Web-Push-Example.git");

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