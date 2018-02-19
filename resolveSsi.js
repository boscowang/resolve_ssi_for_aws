var fs = require('fs');
var lodash = require("lodash");

//console.log = function() {};

var main = function(){
	//var filePathList = ["mini-site/hos2018/en/index.html"];
	var relativeEntryDir = 'mini-site/hos2018/en/';
	var documentRoot = __dirname + "/document_root/";

	console.log(arguments.callee.name, relativeEntryDir);
	console.log(arguments.callee.name, documentRoot);
	
	var run = function(){
		console.log(arguments.callee.name, "start");
		resolveSsiInDir(documentRoot, relativeEntryDir);
		console.log(arguments.callee.name, "end");
	};
	return {
		run: run
	}
}();

var resolveSsiInDir = function(documentRoot, relativeEntryDir){
	console.group();
	var fileList = fs.readdirSync(documentRoot + relativeEntryDir);
	//console.log(arguments.callee.name, "fileList", fileList);

	var htmlFileList = lodash.filter(fileList, function(element) {
		return element.endsWith(".html");
	});
	//console.log(arguments.callee.name, "htmlFileList", htmlFileList);

	var htmlFilePathList = lodash.map(htmlFileList, function(element) {
		return documentRoot + relativeEntryDir + element;
	});
	//console.log(arguments.callee.name, "htmlFilePathList", htmlFilePathList);

	resolveSsiInFilePathList(documentRoot, htmlFilePathList);
	console.groupEnd();
};

var resolveSsiInFilePathList = function(documentRoot, filePathList){
	console.group();
	// map file path to file content
	var fileContentList = lodash.map(filePathList, function(element) {
		return fs.readFileSync(element, 'utf8');
	});

	filePathList.forEach(function(element, index, array) {
		console.log(arguments.callee.name, 'filePathList[' + index + '] = ' + element);
		
		fs.readFile(element, 'utf8', function(err, data) {
		  if (err) throw err;
		  var resolvedContent = resolveSsiInFileContent(documentRoot, fileContentList[index]);
		  fs.writeFileSync(element+".nossi", resolvedContent, 'utf8');
		});		
	});
	console.groupEnd();
};

var resolveSsiInFileContent = function(fileContent){
	var ssiTagList = findSsiTag(fileContent);
	
	if(ssiTagList!=null){
		ssiTagList.forEach(function(element){
			var path = ssiTagToSsiPath(element);
			fileContent = fileContent.replace(element, ssiPathToSsiFileContent(documentRoot, path));
		})
	}
	
	return fileContent;
};

var findSsiTag = function(fileContent){
	return fileContent.match(/<!--#include[\s\S]*?-->/gm);
};

var ssiTagToSsiPath = function(tag){
	var path = tag.match(/(?:(\"|\')(.*?[^\\\\])\1)/g);
	return path[0].substring(1,path[0].length-1);
};

var ssiPathToSsiFileContent = function(documentRoot, path){
	
	var content = fs.readFileSync(documentRoot + path, 'utf8');
	return resolveSsiInFileContent(content);
};

main.run();




