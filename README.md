# windows-elevate

Node module to execute a command in an elevated command prompt.

## Install

	npm install --save windows-elevate

## Execute a command
```
var elevate = require('windows-elevate');

elevate.exec('echo', 'Hello World', function(error, stdout, stderror) {
	if (error) {
		console.error('Failed!');
		return;
	}

	console.log('Success!');
});

// same, but using Promise

elevate.execPromise('echo', 'Hello World', 
	{ wait: true, cmd: 'terminating', cwd: process.cwd(), unicode: true})
.then({stdout, stderr}=>{
	console.log('Success!');
	console.log(stdout);
})
.catch(e=>{
	console.log('Failed!');
})
```