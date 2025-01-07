require('dotenv').config();  // Mengonfigurasi dotenv untuk membaca .env file

const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
