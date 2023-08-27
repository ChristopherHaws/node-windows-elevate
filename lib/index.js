var os = require('os');
var path = require('path');
var childProcess = require('child_process');

var getElevatePath = function() {
	if (os.platform() !== 'win32') throw new Error('This module only works on Windows.');

	if (os.arch() === "x64") {
		return path.join(__dirname,'..','dependencies/elevate/bin.x86-64/elevate.exe').replace('app.asar', 'app.asar.unpacked');
	} else {
		return path.join(__dirname,'..','dependencies/elevate/bin.x86-32/elevate.exe').replace('app.asar', 'app.asar.unpacked');
	}
}
function getElevateArgs(elevateOptions) {
	if (!elevateOptions){
		elevateOptions = { wait: true, cmd: 'terminating', cwd: process.cwd(), unicode: true };
	}

	var args = [];
	if (elevateOptions.cmd === false && elevateOptions.cwd === false) throw new Error('elevateOptions.cmd and elevateOptions.cwd cannot both be false. If you want to use the parent process\'s current working directory, set elevateOptions.cwd to undefined.');
	if (elevateOptions.cmd === 'terminating '|| elevateOptions.cmd === 'persistent') {
		if (elevateOptions.cmd === 'terminating') args.push('-c');
		if (elevateOptions.cmd === 'persistent') args.push('-k');

		if (elevateOptions.cwd === false) args.push('-n');
		if (elevateOptions.unicode) args.push('-u');
	}
	if (elevateOptions.wait) args.push('-w');

	return args;
}


/**
 * Options for Command-Line UAC Elevation Utility.
 * @typedef {Object} WindowsElevateOptions
 * @property {boolean} wait - Waits for termination; equivalent to "start /wait command". Default: true
 * @property {string} cmd - Whether to run persistent cmd.exe (/c), terminating (/k) cmd.exe, or do not use it at all (false). Default: 'terminating'
 * @property {string | undefined | false} cwd - Working directory. specify undefined to use parent process cwd, false (can used only with cmd !== false!!!) to not pushd cwd into cmd.exe. Default: undefined
 * @property {boolean} unicode - When cmd !== false, use Unicode; equivalent to "cmd /u". Default: false
 */

/**
 * A Node.js module that allows you to execute commands with elevated privileges (UAC) on Windows.
 * @module node-windows-elevate
 * @typicalname elevate
 * @example
 * 
 * elevate.execPromise('echo', 'Hello World', 
 * 	{ wait: true, cmd: 'terminating', cwd: process.cwd(), unicode: true})
 * .then({stdout, stderr}=>{
 * 	console.log('Success!');
 * 	console.log(stdout);
 * })
 * .catch(e=>{
 * 	console.log('Failed!');
 * })
 */
module.exports = {
	/**
	 * Executes a command or runs an executeable with elevated privileges.
	 * @param {string} cmd Command to execute.
	 * @param {string | ReadonlyArray<string> | null} options Arguments for command.
	 * @param {(error: ExecFileException, stdout: string, stderr: string) => void | undefined} callback ChildProcess callback function.
	 * @param {WindowsElevateOptions | undefined} elevateOptions Options for Command-Line UAC Elevation Utility.
	 * @returns {import("child_process").ChildProcess}
	 */
	exec: function (cmd, options, callback, elevateOptions) {
		var elevatePath = getElevatePath();
		var args = getElevateArgs(elevateOptions).concat([cmd]).concat(options);

		return childProcess.execFile(elevatePath, args, {cwd: (elevateOptions.cwd && typeof elevateOptions.cwd === 'string') ? elevateOptions.cwd : undefined}, callback);
	},

	/**
	 * Spawns a new process with elevated privileges.
	 * @param {string} cmd Command to execute. 
	 * @param {ReadonlyArray<string> | undefined} args Arguments for command. 
	 * @param {SpawnOptions | undefined} spawnOptions ChildProcess spawn options.
	 * @param {WindowsElevateOptions | undefined} elevateOptions Options for Command-Line UAC Elevation Utility.
	 * @returns {import("child_process").ChildProcess}
	 */
	spawn: function (cmd, args, spawnOptions, elevateOptions) {
		var elevatePath = getElevatePath();
		var args = getElevateArgs(elevateOptions).concat([cmd]).concat(args);

		return childProcess.spawn(elevatePath, args, {...spawnOptions, cwd: (elevateOptions.cwd && typeof elevateOptions.cwd === 'string') ? elevateOptions.cwd : (spawnOptions && spawnOptions.cwd) ? spawnOptions.cwd : undefined});
	},

	/**
	 * Execute a command or run an executeable with elevated privileges.
	 * @param {string} cmd Command to execute.
	 * @param {string | ReadonlyArray<string> | null} options Arguments for command.
	 * @param {WindowsElevateOptions | undefined} elevateOptions Options for Command-Line UAC Elevation Utility.
	 * @returns {Promise<{ stdout: string, stderr: string }>}
	 */

	execPromise: function (cmd, options, elevateOptions) {
		return new Promise(function (resolve, reject) {
			module.exports.exec(cmd, options, function (error, stdout, stderr) {
				if (error) {
					reject(error);			
				} else {
					resolve({ stdout: stdout, stderr: stderr });
				}
			}, elevateOptions);
		});
	}
}