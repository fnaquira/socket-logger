require('dotenv').config();

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const path = require('path');
const fs = require('fs');
const Tail = require('tail').Tail;

const bodyParser = require('body-parser');

//const authRouter = require('./routes/auth');

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);

	// Add this
	if (req.method === 'OPTIONS') {
		res.header(
			'Access-Control-Allow-Methods',
			'PUT, POST, PATCH, DELETE, OPTIONS'
		);
		res.header('Access-Control-Max-Age', 120);
		return res.status(200).json({});
	}
	next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.use(express.static('public'));

const port = process.env.PORT || 8000;

const router = express.Router();

router.get('/', function(req, res) {
	res.json({ message: 'genial! bienvenido a nuestra api!' });
});

//router.use('/auth', authRouter);
router.use((req, res, next) => {
	res.status(404).json({
		error: true,
		message: 'Servicio no encontrado'
	});
});

app.use('/api', router);

app.use(express.static('gui/build'));

app.use((req, res, next) => {
	const file = path.join(__dirname, '/gui/build/index.html');
	res.sendFile(file);
});

server.listen(port, () => {
	console.log(
		`Status Server running on http://localhost:${server.address().port}`
	);
});

//io.set('origins', 'http://localhost:3000');
io.origins((origin, callback) => {
	if (process.env.NODE_ENV !== 'production') {
		if (
			origin.indexOf('http://localhost:3000') !== -1 ||
			origin.indexOf('http://localhost:8000') !== -1
		) {
			callback(null, true);
		}
	} else {
		if (origin.indexOf('miweb.com:8000') !== -1) {
			callback(null, true);
		}
	}
	return callback('origin not allowed', false);
});

const stream = fs.createWriteStream('out.log', { flags: 'a' });
let cont = 0;
setInterval(() => {
	stream.write(`${new Date().toISOString()} => ${cont}\n`);
	cont++;
}, 2000);

const tail = new Tail(path.join(__dirname, './out.log'), {
	fromBeginning: false,
	follow: true,
	useWatchFile: true
});

const initialLines = [];

tail.on('line', line => {
	if (initialLines.length > 20) {
		initialLines.shift();
	}
	initialLines.push(line);
});

io.on('connection', socket => {
	let listenLog = false;
	console.log('usuario conectado');
	socket.emit('log-read', initialLines.join('\n'));

	socket.on('disconnect', () => {
		console.log('se fue el user :(');
	});
	tail.on('line', line => {
		if (listenLog) {
			socket.emit('log-read', line);
		}
	});
	tail.on('error', function(error) {
		console.log('ERROR: ', error);
	});
	socket.on('log-start', () => {
		listenLog = true;
	});
	socket.on('log-end', () => {
		listenLog = false;
	});
});
