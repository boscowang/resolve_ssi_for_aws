// Learning Functional Programming with Javascript
// Chapter 04, Video 03, Exercise 01
var fs = require('fs')

var _ = require("lodash")

var resolveSsiInDir = function(dir){
	var fileList = fs.readdirSync(entryDir);
	//console.log("fileList", fileList);

	var htmlFileList = _.filter(fileList, function(element) {
		return element.endsWith(".html");
	})
	//console.log("htmlFileList", htmlFileList);

	var htmlFilePathList = _.map(htmlFileList, function(element) {
		return entryDir + element;
	})
	//console.log("htmlFilePathList", htmlFilePathList);


	resolveSsiInFilePathList(htmlFilePathList);
}

var resolveSsiInFilePathList = function(filePathList){
	// map file path to file content
	var fileContentList = _.map(filePathList, function(element) {
		return fs.readFileSync(element, 'utf8');
	})

	filePathList.forEach(function(element, index, array) {
		console.log('filePathList[' + index + '] = ' + element);
		
		fs.readFile(element, 'utf8', function(err, data) {
		  if (err) throw err
		  fs.writeFileSync(element+".nossi", resolveSsiInFileContent(fileContentList[index]), 'utf8');
		})		
	})
}

var resolveSsiInFileContent = function(fileContent){
	var ssiTagList = findSsiTag(fileContent);
	
	if(ssiTagList!=null){
		ssiTagList.forEach(function(element){
			var path = ssiTagToSsiPath(element);
			fileContent = fileContent.replace(element, ssiPathToSsiFileContent(path));
		})
	}
	
	return fileContent;
}

var findSsiTag = function(fileContent){
	return fileContent.match(/<!--#include[\s\S]*?-->/gm);
}

var ssiTagToSsiPath = function(tag){
	var path = tag.match(/(?:(\"|\')(.*?[^\\\\])\1)/g);
	return path[0].substring(1,path[0].length-1);
}

var ssiPathToSsiFileContent = function(path){
	var content = fs.readFileSync(__dirname + path, 'utf8');
	return resolveSsiInFileContent(content);
}




//var filePathList = ["mini-site/hos2018/en/index.html"];
var entryDir = 'mini-site/hos2018/en/';

resolveSsiInDir(entryDir);


