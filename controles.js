var fs = require('fs');
var commons = require("./commons.js");

commons=new commons();
file=process.argv[2];
var obj = JSON.parse(fs.readFileSync(file, 'utf8'));

liste=obj.test;
total=liste.length;
nbIgnore=0;
nbprio1=0;
nbprio2=0;
nbprio1etPart=0;
for(var i=0;i<liste.length;i++){
	elem=liste[i];
	elem.url=commons.uniformiseUrl(elem.url);
	
	if(elem.otherlinks && elem.otherlinks.length>0){
		console.log(elem.otherlinks.length);
        for(var j = elem.otherlinks.length - 1; j >= 0; j--){
        	console.log(liste[i].otherlinks[j]);
                liste[i].otherlinks[j]=  commons.uniformiseUrl( elem.otherlinks[j]);  
                if( liste[i].otherlinks[j]==elem.url){
                	elem.otherlinks.splice(j,1);
                }
                  
        }
    }

	if(elem.priorite=="0")
		nbIgnore++;
	if(elem.priorite=="1")
		nbprio1++;
	if(elem.priorite=="1" && elem.offres=="part")
		nbprio1etPart++;
	if(elem.priorite=="2")
		nbprio2++;
	if(elem.source=="seloger"){
		
		for(var j=0;j<liste.length;j++){
			check=liste[j];
			if(i!=j && elem.url.split("\?")[0]==check.url.split("\?")[0]){
				console.log(commons.uniformiseUrl(elem.url));
				console.log(commons.uniformiseUrl(check.url));
			}
		}

	}
}

fs.writeFileSync(file, JSON.stringify(obj, null, 2));
console.log(total+" éléments" )
console.log(nbIgnore+" ignorés" )
console.log(nbprio1+" priorité 1" )
console.log(nbprio1etPart+" priorité 1 et annonce de particulier" )
console.log(nbprio2+" priorité 2" )

