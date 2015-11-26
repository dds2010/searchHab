var fs = require('fs');


file=process.argv[2];
var obj = JSON.parse(fs.readFileSync(file, 'utf8'));

liste=obj.test;
for(var i=0;i<liste.length;i++){
	elem=liste[i];
	if(elem.source=="seloger"){
		
		for(var j=0;j<liste.length;j++){
			check=liste[j];
			if(i!=j && elem.url.split("\?")[0]==check.url.split("\?")[0]){
				console.log(elem.url);
				console.log(check.url);
			}
		}

	}
}



