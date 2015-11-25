var fs = require('fs');

var search = function(dir, needle) {
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


var processFile = function(file, needle) {
  var obj = JSON.parse(fs.readFileSync(file, 'utf8'));
  console.log(obj.test);
  liste=obj.test;
  for(i=0;i<liste.length;i++){
    console.log(liste[i].url);
  }

}
//search(process.argv[2], process.argv[3]);
processFile(process.argv[2], process.argv[3]);

