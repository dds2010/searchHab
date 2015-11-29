var fs = require('fs');


var commons = function (){  
   var self = this;
   self.search = function(dir, needle) {
        if(!fs.existsSync(dir)) {
          return console.log('Directory ' + dir + ' does not exist.');
        }
        
      var haystack = fs.readdirSync(dir), path, stats;
        for(var s = 0; s < haystack.length; s++) {
          path = dir + '/' + haystack[s];
          stats = fs.statSync(path);
          
      if(stats.isDirectory()) {
            search(path, needle);
          } else if(path.indexOf(needle) >= 0) {
            console.log(path);
          }
        }
};
   self.getObjectList = function(file) {
      var obj = JSON.parse(fs.readFileSync(file, 'utf8'));
      return obj.test;
    }

    self.uniformiseUrl = function(url) {

  if(url.indexOf("?")>0)
  {
    return url.split("?")[0];
  }
 
  
  return url;
}

self.unfirmiseCity = function(cityName) {

  if(cityName=="saint_orens_de_gameville")
  {
    return "saint_orens_de_gameville";
  }
  else if(cityName=="escalquens")
  {
    return "Escalquens";
  }
  else if(cityName=="labege")
  {
    return "Labege";
  }
  else if(cityName=="castanet_tolosan")
  {
    return "Castanet Tolosan";
  }
  else if(cityName=="Castanet Tolosan")
  {
    return "Castanet Tolosan";
  }
else if(cityName=="baziege"||cityName=="Baziège")
  {
    return "Baziege";
  }
else if(cityName=="deyme")
  {
    return "Deyme";
  }
else if(cityName=="donneville")
  {
    return "Donneville";
  }
  
  return cityName;
}
self.sameCity = function(newElem,oldElem) {
  
  newCity=this.unfirmiseCity(newElem.city);
  oldCity=this.unfirmiseCity(oldElem.city);


  if(newCity==oldCity){
    return true;
  }

  return false;
}

self.sameUrl = function(newElem,oldElem) {
  
  newUrl=this.uniformiseUrl(newElem.url);
  oldURl=this.uniformiseUrl(oldElem.url);


  if(newUrl==oldURl){
    return true;
  }

  return false;
}

self.finddoublons = function(newElem, referenceList) {


  for(var i=0;i<referenceList.length;i++){
    iterator=referenceList[i];

    if(!iterator.otherlinks){
      iterator.otherlinks=[];
    }
     iterator.city=this.unfirmiseCity(iterator.city);
    if(this.uniformiseUrl(newElem.url)==this.uniformiseUrl(iterator.url))
    {
      console.log("found: meme url");
      return iterator;
    }
    else if(newElem.prix==iterator.prix && newElem.surface==iterator.surface && this.sameCity(newElem,iterator) && newElem.titre==iterator.titre)
    {
      //meme prix surface et vile
      iterator.otherlinks.push(newElem.url);
      console.log("found: meme prix surface et ville");
      return iterator;
    }
    else if(newElem.ges && newElem.nrj && newElem.nrj==iterator.nrj && newElem.ges==iterator.ges && newElem.surface==iterator.surface && this.sameCity(newElem,iterator) && newElem.titre==iterator.titre)
    {
      //meme prix surface et vile
      iterator.otherlinks.push(newElem.url);
      console.log("found: meme ges,nrj surface et ville prix:"+newElem.prix+" ancien:"+iterator.prix+" ges:"+newElem.ges );
      return iterator;
    }
    else if(newElem.ges && newElem.nrj && newElem.nrj==iterator.nrj && newElem.ges==iterator.ges && newElem.surface==iterator.surface && this.sameCity(newElem,iterator) && newElem.titre==iterator.titre)
    {
      //meme prix surface et vile
      iterator.otherlinks.push(newElem.url);
      console.log("found: meme ges,nrj surface et ville prix:"+newElem.prix+" ancien:"+iterator.prix+" ges:"+newElem.ges );
      return iterator;
    }
    else if(newElem.ges && newElem.nrj && newElem.nrj==iterator.nrj && newElem.ges==iterator.ges && newElem.surface==iterator.surface && this.sameCity(newElem,iterator) )
    {
      //meme prix surface et vile
      iterator.otherlinks.push(newElem.url);
      console.log("found: meme ges,nrj surface et ville prix:"+newElem.prix+" ancien:"+iterator.prix+" ges:"+newElem.ges );
      return iterator;
    }
    /* else if(newElem.ges && newElem.nrj && newElem.nrj==iterator.nrj && newElem.ges==iterator.ges && newElem.surface==iterator.surface  )
    {
      //meme prix surface et vile
      console.log("found: meme ges,nrj surface et ville prix:"+newElem.prix+" ancien:"+iterator.prix+" ges:"+newElem.ges );
      return iterator;
    }*/
    /*else if(newElem.city==iterator.city 
                                && newElem.titre==iterator.titre && newElem.surface==iterator.surface
                                && Math.abs(newElem["prix"]-iterator["prix"])<40000){
      console.log(newElem["surface"]+" "+newElem["city"]+" "+newElem["titre"]+"("+newElem["dateMaj"]+" "+newElem["prix"] +") doublon et changement de prix de "+iterator["titre"]+"("+iterator["dateMaj"]+" "+iterator["prix"]+")")
      return iterator;
    }   
    else if(newElem.city==iterator.city 
                                && newElem.titre==iterator.titre && Math.abs(newElem["surface"]-iterator["surface"])<4
                                && Math.abs(newElem["prix"]-iterator["prix"])<10000){
      console.log(newElem["surface"]+" "+newElem["city"]+" "+newElem["titre"]+"("+newElem["dateMaj"]+" "+newElem["prix"] +") doublon et changement de prix/surface de "+iterator["titre"]+"/"+iterator["surface"]+"("+iterator["dateMaj"]+" "+iterator["prix"]+")")
      return iterator;
    }  */
  }

}
self.writeFile= function(reference,filename) {
 
  fs.writeFileSync(filename, JSON.stringify(reference, null, 2));
}

self.updateReference = function(reference,newItem) {
 

  
  if(newItem.prix!=reference.prix && newItem.url==reference.url){
    reference.commentaire=reference.commentaire+" prix  le "+reference.dateMaj+" = "+reference.prix;
    reference.commentaire=reference.commentaire+" prix  le "+newItem.dateMaj+" = "+newItem.prix;
    reference.commentaire=reference.commentaire+" URL "+newItem.url;

    console.log("!!!!différence de prix=>update commentaire");
    console.log(reference.url);
    console.log(newItem.url);
  }
  else{
    console.log("meme prix"+newItem.prix);
     console.log(reference.url);
    console.log(newItem.url);
  }
  if(newItem.ges && newItem.url==reference.url)
    reference.ges=newItem.ges;
  if(newItem.nrj && newItem.url==reference.url)
    reference.nrj=newItem.nrj;
  if(newItem.cp && newItem.url==reference.url)
    reference.cp=newItem.cp;
  if(newItem.codeInsee && newItem.url==reference.url)
    reference.codeInsee=newItem.codeInsee;
  

  reference.dateMaj=newItem.dateMaj;
}


self.processFile = function(file, needle) {
  var obj = JSON.parse(fs.readFileSync(file, 'utf8'));
  //console.log(obj.test);
  liste=obj.test;
  for(i=0;i<liste.length;i++){
    //console.log(liste[i].url);
    liste[i].url="toto";
  }

  fs.writeFileSync("out.json", JSON.stringify(obj, null, 2));
}
}

module.exports = commons;