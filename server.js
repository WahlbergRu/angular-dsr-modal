var serverFactory = require('spa-server');

var server = serverFactory.create({
    path: './',
    port: 8001,
    fallback: {
        'text/html' : '/index.html'
    }
});

server.start();
 