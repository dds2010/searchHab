var fs = require('fs');
var commons = require("./commons.js");

commons=new commons();


//search(process.argv[2], process.argv[3]);
console.log(process.argv[2]);
console.log(process.argv[3]);
//processFile(process.argv[2], process.argv[3]);
toAddList=[];
reference=commons.getObjectList(process.argv[3]);
liste=commons.getObjectList(process.argv[2]);
for(var i=0;i<liste.length;i++){
  firstElem=liste[i];
  //console.log("process:"+firstElem.url)
  firstDoublon=commons.finddoublons(firstElem,reference);
  if(firstDoublon){
    firstDoublon["conso"]=firstElem.conso;
    commons.updateReference(firstDoublon,firstElem);
    //console.log(firstDoublon);
  }
  else{
    toAddList.push(firstElem);
    reference.push(firstElem);
  }

}

newRef={"test":reference}
commons.writeFile(newRef,"new_ref.json");
commons.writeFile(toAddList,"new_annonces.json");

console.log("nouvelles annonces:"+toAddList.length);