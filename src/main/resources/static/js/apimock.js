//@author hcadavid

apimock=(function(){

	var mockdata=[];

	mockdata["johnconnor"]=[
		{author:"johnconnor","points":[{"x":150,"y":120},{"x":215,"y":115}],"name":"house"},
		{author:"johnconnor","points":[{"x":340,"y":240},{"x":15,"y":215}],"name":"gear"},
		{author:"johnconnor","points":[
				{"x":50,"y":60},{"x":70,"y":80},{"x":90,"y":100},
				{"x":120,"y":140},{"x":160,"y":180}
			],"name":"bunker"}
	];

	mockdata["maryweyland"]=[
		{author:"maryweyland","points":[{"x":140,"y":140},{"x":115,"y":115}],"name":"house2"},
		{author:"maryweyland","points":[{"x":140,"y":140},{"x":115,"y":115}],"name":"gear2"},
		{author:"maryweyland","points":[
				{"x":200,"y":200},{"x":220,"y":240},{"x":260,"y":200},
				{"x":300,"y":250},{"x":340,"y":220},{"x":380,"y":260}
			],"name":"spaceship"}
	];

	mockdata["sarahconnor"]=[
		{author:"sarahconnor","points":[
				{"x":10,"y":10},{"x":30,"y":50},{"x":60,"y":40},
				{"x":100,"y":80},{"x":140,"y":60}
			],"name":"skynet-lab"}
	];

	return {
		getBlueprintsByAuthor:function(authname,callback){
			callback(
				mockdata[authname]
			);
		},

		getBlueprintsByNameAndAuthor:function(authname,bpname,callback){
			callback(
				mockdata[authname].find(function(e){return e.name===bpname})
			);
		}
	}

})();

/*
Example of use:
var fun=function(list){
	console.info(list);
}

apimock.getBlueprintsByAuthor("johnconnor",fun);
apimock.getBlueprintsByNameAndAuthor("johnconnor","house",fun);
*/
