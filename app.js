var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var debug = require('debug')('myapp:server');
var http = require('http');
var mqtt = require('mqtt');
var rulesRouter = require('./rules/crudRules.js');
var getRules = require('./rules/getRules.js');
var getStates = require('./states/getStates.js');
var processMsg = require('./processMsg');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
  res.render('index', { title: 'PolicyControl' });
})

app.use("/api/rules", rulesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('404')
});



/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}





async function init() {
  global.policy = [];
  global.relation = new Map();
  global.states = {};
  await getRules();
  await getStates();
  console.log(global.states);
  console.log(global.policy);
  console.log(global.relation);
}

init()

var client = mqtt.connect("mqtt://localhost:8000"); 

client.on('connect',function(){
  console.log("connected");
  client.subscribe('test',{qos:1});
})

  
client.on('message',function(topic,message) {  
    var msg = JSON.parse(message.toString());
    processMsg(msg)
});  






