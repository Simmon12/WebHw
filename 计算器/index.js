var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
    switch (req.url) {
        case '/calculator.css':
          sendFile(res, 'calculator.css', 'text/css');
          break;
        case '/calculator.js':
          sendFile(res, 'calculator.js', 'text/javascript');
          break;
        default:
          sendFile(res, 'calculator.html', 'text/html')
    }
}).listen(8124);
console.log("server is listening at 8124");

function sendFile(res, file, mine)  {
    res.writeHead(200, "Content-Type:" + mine);
    res.end(fs.readFileSync(file));
}
