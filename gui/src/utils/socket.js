import openSocket from 'socket.io-client';
const socket = openSocket('http://see.conflux.pe:8000');

const subscribeToLog = cb => {
	socket.on('log-read', line => cb(line));
	socket.emit('log-start');
};

const unsubscribeToLog = () => {
	socket.emit('log-end');
};

export { subscribeToLog, unsubscribeToLog };
