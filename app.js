var express = require('express')
	, app = express()
	, http = require('http').Server(app)
	, io = require('socket.io')(http)
	, bodyParser = require('body-parser')
	, cons = require('consolidate');

var messages = {};

app.engine('html', cons.swig)
app.set('view engine', 'html');
app.set('views', __dirname + '/views')

app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.render('index', {});
});

app.post('/chat', function(req, res) {
	var username = req.body.username;
	res.cookie('username', username);
	res.render('chat', {'username': username});
});

io.on('connection', function(socket){
  socket.on('chat message', function(data){

		io.emit('chat message', data);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
