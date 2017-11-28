const spawn = require('child_process').spawn;

module.exports = function(script, params) {
  return new Promise(function(resolve, reject) {
    const child = spawn(script, [], params);

    child.stdout.on('data', function(data) {
      console.log('stdout: ' + data.toString());
    });

    child.stderr.on('data', function(data) {
      console.log('stderr: ' + data.toString());
    });

    child.on('exit', resolve);
  });
};
