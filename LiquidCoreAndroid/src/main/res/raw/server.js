var http = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')
var baseDirectory = '/home/local'

// Create a file to serve

var source = "LiquidEvents.emit('msg',{msg: 'Hello, World!'})"

fs.writeFile('/home/local/hello.js',
   source,
   function(err) {
       if(err) {
           return console.log(err);
       }
   }
)

var server = http.createServer(function (request, response) {
   try {
     var requestUrl = url.parse(request.url)

     var fsPath = baseDirectory+path.normalize(requestUrl.pathname)

     response.writeHead(200)
     var fileStream = fs.createReadStream(fsPath)
     fileStream.pipe(response)
     fileStream.on('error',function(e) {
         response.writeHead(404)
         response.end()
     })
   } catch(e) {
     response.writeHead(500)
     response.end()
     console.log(e.stack)
   }
})

server.on('listening',function() {
    console.log("listening on port "+server.address().port)
    LiquidEvents.emit('listening', {port: server.address().port})
})
server.listen()