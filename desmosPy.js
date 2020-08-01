//HTML/CSS

//Classes
//+funções DesmosAPI
//Colunas
//Pastas (ids)
//Imagens (upload)
//Empty properties

//Known bug: decorator order change (skulpt)

var $builtinmodule = function (name) {
	var desmos = {};

	//Constants (colors)
	desmos.RED = 	Sk.builtin.str('#c74440');
	desmos.BLUE = 	Sk.builtin.str('#2d70b3');
	desmos.GREEN = 	Sk.builtin.str('#388c46');
	desmos.PURPLE = Sk.builtin.str('#6042a6');
	desmos.ORANGE = Sk.builtin.str('#fa7e19');
	desmos.BLACK = 	Sk.builtin.str('#000000');

	//Desmos class
	desmos.Desmos = Sk.misceval.buildClass(desmos, function($gbl, $loc) {
		var initFunction = function(self, calc) { //Associa o objeto a um 'Calc'
			self.tp$setattr(Sk.builtin.str('calc'), calc);
		}
		initFunction.co_varnames = ['calc'];
		initFunction.$defaults = [Sk.builtin.str('Calc')];
		initFunction.co_argcount = 2;
		$loc.__init__ = new Sk.builtin.func(initFunction);
		
		$loc.expressions = Sk.builtin.list();
		$loc.graph = Sk.builtin.dict();
		$loc.randomSeed = Sk.builtin.str();
		$loc.currentFolderID = Sk.builtin.str(); //Sk.builtin.str()?

		var getState = function(self, keepExpressions, keepGraph, keepRandomSeed) { //Carrega valores de calc
			var calc = Sk.ffi.remapToJs(self.tp$getattr(Sk.builtin.str('calc')));
			keepExpressions = Sk.ffi.remapToJs(keepExpressions);
			keepGraph = Sk.ffi.remapToJs(keepGraph);
			keepRandomSeed = Sk.ffi.remapToJs(keepRandomSeed);

			var calcState = window[calc].getState();
			if (keepExpressions) {
				self.tp$setattr(Sk.builtin.str('expressions'), Sk.ffi.remapToPy(calcState.expressions.list));
			}
			if (keepGraph) {
				self.tp$setattr(Sk.builtin.str('graph'), Sk.ffi.remapToPy(calcState.graph));
			}
			if (keepRandomSeed) {
				self.tp$setattr(Sk.builtin.str('randomSeed'), Sk.builtin.str(calcState.randomSeed));
			}
		};
		getState.$defaults = [Sk.builtin.bool.false$, Sk.builtin.bool.true$, Sk.builtin.bool.true$];
		getState.co_argcount = 4;
		$loc.getState = new Sk.builtin.func(getState);

		var setState = function(self) { //Seta valores de calc
			var calc = Sk.ffi.remapToJs(self.tp$getattr(Sk.builtin.str('calc')));
			var expressions = Sk.ffi.remapToJs(self.tp$getattr(Sk.builtin.str('expressions')));
			var graph = Sk.ffi.remapToJs(self.tp$getattr(Sk.builtin.str('graph')));
			var randomSeed = Sk.ffi.remapToJs(self.tp$getattr(Sk.builtin.str('randomSeed')));

			var calcState = {
				version: 7,
				graph: graph,
				randomSeed: randomSeed,
				expressions: {list: expressions}
			};
			window[calc].setState(calcState);
		};
		setState.co_argcount = 1;
		$loc.setState = new Sk.builtin.func(setState);
		

		var Expression = function(self, latex, properties) { //Instancia uma Expression e a adiciona a expressions
			var folderID = self.tp$getattr(Sk.builtin.str('currentFolderID'));
			var expressions = self.tp$getattr(Sk.builtin.str('expressions'));
			var expression = Sk.misceval.callsimArray($gbl.Expression, [latex, properties, folderID]);
			expressions.v.push(expression);
			return expression;
		};
		Expression.$defaults = [Sk.builtin.none.none$, Sk.builtin.none.none$];
		Expression.co_argcount = 3;
		$loc.Expression = new Sk.builtin.func(Expression);

		var Note = function(self, text, properties) { //Instancia uma Note e a adiciona a expressions
			var folderID = self.tp$getattr(Sk.builtin.str('currentFolderID'));
			var expressions = self.tp$getattr(Sk.builtin.str('expressions'));
			var expression = Sk.misceval.callsimArray($gbl.Note, [text, properties, folderID]);
			expressions.v.push(expression);
			return expression;
		};
		Note.$defaults = [Sk.builtin.none.none$, Sk.builtin.none.none$];
		Note.co_argcount = 3;
		$loc.Note = new Sk.builtin.func(Note);

		var Table = function(self, columns, properties) { //Instancia uma Table e a adiciona a expressions //...
			var folderID = self.tp$getattr(Sk.builtin.str('currentFolderID'));
			var expressions = self.tp$getattr(Sk.builtin.str('expressions'));
			var expression = Sk.misceval.callsimArray($gbl.Table, [columns, properties, folderID]);
			expressions.v.push(expression);
			return expression;
		};
		Table.$defaults = [Sk.builtin.none.none$, Sk.builtin.none.none$];
		Table.co_argcount = 3;
		$loc.Table = new Sk.builtin.func(Table);

		var Image = function(self, name, imageURL, properties) { //Instancia uma Image e a adiciona a expressions //...
			var folderID = self.tp$getattr(Sk.builtin.str('currentFolderID'));
			var expressions = self.tp$getattr(Sk.builtin.str('expressions'));
			var expression = Sk.misceval.callsimArray($gbl.Image, [name, imageURL, properties, folderID]);
			expressions.v.push(expression);
			return expression;
		};
		Image.$defaults = [Sk.builtin.none.none$, Sk.builtin.none.none$];
		Image.co_argcount = 4;
		$loc.Image = new Sk.builtin.func(Image);

		var Folder = function(self, title, properties) { //Instancia uma Folder e a adiciona a expressions
			var expressions = self.tp$getattr(Sk.builtin.str('expressions'));
			var expression = Sk.misceval.callsimArray($gbl.Folder, [title, properties]);
			expressions.v.push(expression);
			return expression;
		};
		Folder.$defaults = [Sk.builtin.none.none$, Sk.builtin.none.none$];
		Folder.co_argcount = 3;
		$loc.Folder = new Sk.builtin.func(Folder);

	},'Desmos', []);
	

	var Expression = function(latex, properties, folderID) {
		latex = Sk.ffi.remapToJs(latex);
		properties = Sk.ffi.remapToJs(properties);
		folderID = Sk.ffi.remapToJs(folderID);
		var expression = Object.assign({}, {type: 'expression'}, latex?{latex: latex}:{}, folderID?{folderId: folderID}:{}, properties);
		return Sk.ffi.remapToPy(expression);
	};
	Expression.$defaults = [Sk.builtin.none.none$, Sk.builtin.none.none$, Sk.builtin.none.none$];
	Expression.co_argcount = 3;
	desmos.Expression = new Sk.builtin.func(Expression);

	var Note = function(text, properties, folderID) {
		text = Sk.ffi.remapToJs(text);
		properties = Sk.ffi.remapToJs(properties);
		folderID = Sk.ffi.remapToJs(folderID);
		var expression = Object.assign({}, {type: 'text'}, text?{text: text}:{}, folderID?{folderId: folderID}:{}, properties);
		return Sk.ffi.remapToPy(expression);
	};
	Note.$defaults = [Sk.builtin.none.none$, Sk.builtin.none.none$, Sk.builtin.none.none$];
	Note.co_argcount = 3;
	desmos.Note = new Sk.builtin.func(Note);

	var Table = function(columns, properties, folderID) {
		columns = Sk.ffi.remapToJs(columns);
		properties = Sk.ffi.remapToJs(properties);
		folderID = Sk.ffi.remapToJs(folderID);
		var expression = Object.assign({}, {type: 'table'}, columns?{columns: columns}:{}, folderID?{folderId: folderID}:{}, properties);
		return Sk.ffi.remapToPy(expression);
	};
	Table.$defaults = [Sk.builtin.none.none$, Sk.builtin.none.none$, Sk.builtin.none.none$];
	Table.co_argcount = 3;
	desmos.Table = new Sk.builtin.func(Table);

	/*var Column = function(latex, values, properties) { //...
		latex = Sk.ffi.remapToJs(latex);
		values = Sk.ffi.remapToJs(values);
		properties = Sk.ffi.remapToJs(properties);
		var expression = Object.assign({}, latex?{latex: latex}:{}, values?{values: values}:{}, properties);
		return Sk.ffi.remapToPy(expression);
	};
	Column.$defaults = [Sk.builtin.none.none$, Sk.builtin.none.none$, Sk.builtin.none.none$];
	Column.co_argcount = 3;
	desmos.Column = new Sk.builtin.func(Column);*/

	var Image = function(name, imageURL, properties, folderID) { //...
		name = Sk.ffi.remapToJs(name);
		imageURL = Sk.ffi.remapToJs(imageURL);
		properties = Sk.ffi.remapToJs(properties);
		folderID = Sk.ffi.remapToJs(folderID);
		var expression = Object.assign({}, {type: 'image'}, name?{name: name}:{}, imageURL?{image_url: imageURL}:{}, folderID?{folderId: folderID}:{}, properties);
		return Sk.ffi.remapToPy(expression);
	};
	Image.$defaults = [Sk.builtin.none.none$, Sk.builtin.none.none$, Sk.builtin.none.none$, Sk.builtin.none.none$];
	Image.co_argcount = 4;
	desmos.Image = new Sk.builtin.func(Image);

	var Folder = function(title, properties) {
		title = Sk.ffi.remapToJs(title);
		properties = Sk.ffi.remapToJs(properties);
		var expression = Object.assign({}, {type: 'folder'}, title?{title: title}:{}, properties);
		return Sk.ffi.remapToPy(expression);
	};
	Folder.$defaults = [Sk.builtin.none.none$, Sk.builtin.none.none$];
	Folder.co_argcount = 2;
	desmos.Folder = new Sk.builtin.func(Folder);

	folder = function(desmosObject) { //...
		return new Sk.builtin.func(function(pyFunc){
			return new Sk.builtin.func(function(...args){
				var lastFolderID = desmosObject.tp$getattr(Sk.builtin.str('currentFolderID'));
				var folderName = Sk.builtin.str(pyFunc.tp$name); //...
				Sk.misceval.callsimArray(desmosObject.Folder, [desmosObject, folderName, Sk.ffi.remapToPy({id: folderName})]); 
				desmosObject.tp$setattr(Sk.builtin.str('currentFolderID'), folderName);
				Sk.misceval.callsim(pyFunc, ...args);
				desmosObject.tp$setattr(Sk.builtin.str('currentFolderID'), lastFolderID);
			});
		});
	}
	folder.co_argcount = 1;
	desmos.folder = new Sk.builtin.func(folder);

	return desmos;
};