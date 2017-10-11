var http = require("http");
var child_process = require("child_process");
var githubWebhook = require("github-webhook-handler");
var handler  = githubWebhook({path:"/",secret:"ss"})


function run_cmd(cmd, args, callback) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var resp = "";

  child.stdout.on('data', function(buffer) { resp += buffer.toString(); });
  child.stdout.on('end', function() { callback (resp) });
}


http.createServer(function(req,res){
    handler(req,res,function(err){
        res.statusCode = 404
        res.end('no such location')
    });
}).listen(5002);

handler.on('error', function (err) {
  console.error('Error:', err.message)
})
 
handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref)
    
    run_cmd('sh', ['./deploy.sh',event.payload.repository.name], function(text){ console.log(text) });
})