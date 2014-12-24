var express = require('express')
	, app = express()
	, http = require('http').Server(app)
	, io = require('socket.io')(http)
	, bodyParser = require('body-parser')
	, cons = require('consolidate')
	, cookieParser = require('socket.io-cookie-parser');

var messages = [];

app.engine('html', cons.swig)
app.set('view engine', 'html');
app.set('views', __dirname + '/views')

app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
io.use(cookieParser());

app.get('/', function(req, res){
	res.render('index', {});
});

app.post('/chat', function(req, res) {
	var username = req.body.username;
	res.cookie('username', username);
	res.render('chat', { 'username': username });
});

io.on('connection', function(socket){

	socket.emit('old messages', messages);

	socket.on('connection', function() {

		var users = [];
		var sockets = io.sockets.sockets;
		sockets.forEach(function(socket) {
			users.push(socket.request.cookies.username);
		});
		io.emit('users online', users);
	});

  socket.on('chat message', function(data){

		var username = this.request.cookies.username;
		data.username = username;
		if(messages.length > 20) {
			messages.unshift();
		} else {
			messages.push(data);
		}
		io.emit('chat message', data);
  });

	socket.on('disconnect', function() {

		var users = [];
		var sockets = io.sockets.sockets;
		sockets.forEach(function(socket) {
			if(socket !== this)
			users.push(socket.request.cookies.username);
		});
		io.emit('users online', users);
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
