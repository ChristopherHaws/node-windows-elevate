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
```