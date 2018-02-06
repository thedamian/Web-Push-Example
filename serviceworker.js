// serviceworker.js
// The serviceworker context can respond to 'push' events and trigger
// notifications on the registration property
self.addEventListener("push", (event) => {
  let title = (event.data && event.data.text()) || "a default message if nothing was passed to us";
  let body = "We have received a push message";
  let tag = "push-simple-demo-notification-tag";
  let icon = '/icon.png';

  event.waitUntil(
    self.registration.showNotification(title, { body, icon, tag })
  )
});