// app/index.js

const express = require("express");
const morgan = require("morgan");
const router = require("./config/routes");
const fs = require('fs');
const path = require("path");
const http = require('http');
const https = require('https');
const cors = require('cors');
const controller = require("./app/controllers");
const envPath = path.resolve(__dirname, '.env');
require('dotenv').config({ path: envPath });

const app = express();

app.use(cors({
    origin: 'https://front-end-binar-aov4zrr5r-yosuas-projects-8e558ba3.vercel.app'
}));

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan("dev"));

/** Install JSON request parser */
app.use(express.json());

app.use(controller.api.main.onParseError);
app.use(controller.api.main.onError);

/** Install Router */
app.use(router);

// Menggunakan HTTP atau HTTPS berdasarkan lingkungan
const httpPort = process.env.HTTP_PORT;
const httpsPort = process.env.HTTPS_PORT;

let server;

if (process.env.NODE_ENV === 'production') {
    // Menggunakan HTTPS di lingkungan produksi
    const privateKey = fs.readFileSync(process.env.SSL_PRIVATE_KEY_PATH, 'utf8');
    const certificate = fs.readFileSync(process.env.SSL_CERTIFICATE_PATH, 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    server = https.createServer(credentials, app);
    console.log(`HTTPS Server is running on ${process.env.NODE_ENV} mode at https://localhost:${httpsPort}`);
} else {
    // Menggunakan HTTP di lingkungan pengembangan
    server = http.createServer(app);
    console.log(`HTTP Server is running on ${process.env.NODE_ENV} mode at http://localhost:${httpPort}`);
}

server.listen(process.env.NODE_ENV === 'production' ? httpsPort : httpPort);