var express    = require('express'),
    proxy      = require('http-proxy').createProxyServer(),
    publicPath = require('path').resolve(__dirname, '..' , 'public'),
    app        = express(),
    server     = require('http').Server(app),
    io         = require('socket.io')(server)
    isProd     = process.env.NODE_ENV === 'production';

// We point to our static assets
app.use(express.static(publicPath));

// We only want to run the workflow when not in production
if (!isProd) {

  // We require the bundler inside the if block because
  // it is only needed in a development environment. Later
  // you will see why this is a good idea
  require('./bundle.js')(); 

  // Any requests to localhost:3000/build is proxied
  // to webpack-dev-server
  app.all('/dist/*', function (req, res) {
    proxy.web(req, res, {target: 'http://localhost:8080'});
  });
}

// Handle socket streams
io.on('connection', function (socket) {
  socket.emit('client:position', { message: 'world' });

  socket.on('device:position', function(data){
    io.sockets.emit('client:position', data);
  });

  socket.on('device:fire', function(data){
    io.sockets.emit('client:fire', data);
  });

  socket.on('disconnect', function(){
    // console.log('someone died');
  });
});

// Catchall - redirect to app base
app.get('*', function(req, res){
  res.sendFile(publicPath + '/index.html');
});

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the
// server when webpack is bundling
proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
});

// And run the server
server.listen(process.env.PORT || 3000, function () {
  console.log('Server running on port ' + (process.env.PORT || 3000));
});