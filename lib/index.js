var os = require('os');
var path = require('path');
var childProcess = require('child_process');

var getElevatePath = function() {
	if (os.arch() === "x64") {
		return path.join(__dirname,'..','dependencies/elevate/bin.x86-64/elevate.exe');
	} else {
		return path.join(__dirname,'..','dependencies/elevate/bin.x86-32/elevate.exe');
	}
}

module.exports = {
	exec: function (cmd, options, callback, switches) {
		var elevatePath = getElevatePath();
		
		if (switches === null) {
			switches = ['-c', '-w'];
		}
		var args = switches.concat(cmd, options);

		return childProcess.execFile(elevatePath, args, callback);
	}
}
