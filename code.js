//Observador de mutação (para esperar a página carregar antes de modificá-la)
var observer = new MutationObserver(function (mutationsList, observer) {
	var expressionPanel = document.getElementsByClassName("dcg-exppanel")[0];
	if (expressionPanel) {
		setUpPage(expressionPanel);
		observer.disconnect();
		return;
	}
});
observer.observe(document, {childList: true, subtree: true});

var codeMirror;
function setUpPage (expressionPanel) {
	//Modifica o  HTML do painel de expressões
	document.getElementsByClassName("dcg-expressions-branding")[0].remove();
	var html = document.createElement("div");
	expressionPanel.appendChild(html);
	html.outerHTML = ''+
		'<div class="dcg-code" style="display: none;">\n'+
		'</div>\n'+
		'<div class="tabs">\n'+
		'	<button id="desmos-tablink">Desmos</button>\n'+
		'	<button id="code-tablink">Code</button>\n'+
		'</div>\n'+
		'<button id="run-code">Run</button>\n';

	//Adiciona a área de código
	codeMirror = CodeMirror(document.getElementsByClassName("dcg-code")[0],
		{mode:"python", theme:"mdn-like",
		lineWrapping:true, lineNumbers:true, styleActiveLine:true,
		indentWithTabs:true, tabSize:2, matchBrackets:true,
		scrollbarStyle:"null"}); //?

	//Seta os eventos click dos tablinks
	var desmosTablink = document.getElementById("desmos-tablink");
	desmosTablink.tabClass = "dcg-expressionlist";
	desmosTablink.addEventListener("click", changeTab, false);
	var codeTablink = document.getElementById("code-tablink");
	codeTablink.tabClass = "dcg-code";
	codeTablink.addEventListener("click", changeTab, false);
	//Seta o evento click do botão Run
	var runButton = document.getElementById("run-code");
	runButton.addEventListener("click", runCode, false);

	//Injeta os scripts skulpt
	var skulptScript = document.createElement('script');
	skulptScript.src = chrome.runtime.getURL('skulpt/skulpt.min.js');
	document.head.appendChild(skulptScript);
	skulptScript.onload = function(){
		skulptScript = document.createElement('script');
		skulptScript.src = chrome.runtime.getURL('skulpt/skulpt-stdlib.js');
		document.head.appendChild(skulptScript);
		//Injeta o nosso script
		skulptScript.onload = function(){
			var injectedScript = document.createElement('script');
			injectedScript.innerHTML = 'var desmosCodeURL = "'+chrome.runtime.getURL('desmosPy.js').toString()+'";';
			document.head.appendChild(injectedScript);
			injectedScript = document.createElement('script');
			injectedScript.src = chrome.runtime.getURL('injectedScript.js');
			document.head.appendChild(injectedScript);
		}
	};

}

//Troca a aba quando um botão é apertado
function changeTab (event) {
	document.getElementsByClassName("dcg-expressionlist")[0].style.display = "none";
	document.getElementsByClassName("dcg-code")[0].style.display = "none";
	document.getElementsByClassName(event.currentTarget.tabClass)[0].style.display = "block";	
	
	document.getElementById("desmos-tablink").className = "tablink";
	document.getElementById("code-tablink").className = "tablink";
	event.currentTarget.className = "tablink active";

	codeMirror.refresh();
}

//Executado quando o botão Run é apertado
function runCode () {
	var code = codeMirror.getValue();
	setTimeout( function() { //Emite um evento enviando code para o injectedScript
		document.dispatchEvent(new CustomEvent('runCode_desmosExtension', {
			detail: code //Objeto enviado
		}));
	}, 0);
}