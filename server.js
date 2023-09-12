const express = require('express');
const chokidar = require('chokidar');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Watch for changes in the 'public' directory
const watcher = chokidar.watch('public');

// Reload the page when any file in 'public' changes
watcher.on('change', () => {
  console.log('Reloading the page...');
  io.emit('reload');
});

// Serve 'index.html' directly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Set up a WebSocket server
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});