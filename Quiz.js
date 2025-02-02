const http = require('http');

const port = 3000;

const server = http.createServer((req, res) => {
  try {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, world!\n');
  } catch (error) {
    handleError(res, error);
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

function handleError(res, error) {
  console.error('An error occurred:', error);
  res.statusCode = 500;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Internal Server Error\n');
}