navigator.serviceWorker.register('service-worker.js', {
  scope: '/'
});

if (navigator.serviceWorker.controller) {
  console.log('This page is currently controlled by:', navigator.serviceWorker.controller);
}

console.log("I am index.js!");
setInterval(() => {
  fetch('/index.html');
}, 2000);