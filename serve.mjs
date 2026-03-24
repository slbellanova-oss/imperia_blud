import http from 'http';
import { createReadStream } from 'fs';
import { join } from 'path';

const port = 3000;
const hostname = 'localhost';

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    let filePath = req.url === '/' ? '/index.html' : req.url;
    let contentType = 'text/html';

    if (filePath.endsWith('.css')) {
        contentType = 'text/css';
    } else if (filePath.endsWith('.js')) {
        contentType = 'application/javascript';
    } else if (filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.gif') || filePath.endsWith('.ico')) {
        contentType = 'image/jpeg';
    } else if (filePath.endsWith('.svg')) {
        contentType = 'image/svg+xml';
    } else if (filePath.endsWith('.woff') || filePath.endsWith('.woff2')) {
        contentType = 'font/woff2';
    }

    const filePathFull = join(process.cwd(), filePath);

    createReadStream(filePathFull)
        .on('error', () => {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        })
        .pipe(res.setHeader('Content-Type', contentType));
});

server.listen(port, hostname, () => {
    console.log(`🚀 Server running at http://${hostname}:${port}/`);
    console.log(`📝 Serving files from: ${process.cwd()}`);
    console.log(`📝 Test the website at: http://localhost:${port}/`);
});