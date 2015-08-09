var cluster = require('cluster');
var os = require('os');

var cpuCores = os.cpus().length;
var workers = {};

if (cluster.isMaster) {
    cluster.on('death', function(worker) {
       delete workers[worker.pid];
        worker = cluster.fork();
        workers[worker.pid] = worker;
    });
    for (var i=0; i<cpuCores; i+=1) {
        var worker = cluster.fork();
        workers[worker.process.pid] = worker;
        console.log(worker.process.pid)
    }
} else if (cluster.isWorker) {
    var app = require('./start');
    app.listen(3000);
}

process.on('SIGTERM', function () {
    for (var pid in workers) {
        process.kill(pid);
    }
    process.exit(0);
});