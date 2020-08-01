function outf (text) { 
	console.log(text);
}

function builtinRead (filename) {
	if (filename == './desmos.js') {
		return Sk.misceval.promiseToSuspension(
			fetch(desmosCodeURL)
				.then(r => r.text())
		);
	}
	
	if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][filename] === undefined)
		throw "File not found: '" + filename + "'";
	return Sk.builtinFiles["files"][filename];
}

document.addEventListener('runCode_desmosExtension', function(e) {
	var code = e.detail;
	
	Sk.configure({output:outf, read:builtinRead}); 
	var skPromise = Sk.misceval.asyncToPromise(function() {
		return Sk.importMainWithBody("<stdin>", false, code, true);
	});
	skPromise.then(function(mod) {
		console.log('success');
	},
		function(err) {
		console.log(err.toString());
	});
});

//var calcState = Calc.getState();
//Calc.setState(calcState);