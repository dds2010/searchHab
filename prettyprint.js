var fs = require('fs');


file=process.argv[2];
var obj = JSON.parse(fs.readFileSync(file, 'utf8'));


fs.writeFileSync(file, JSON.stringify(obj, null, 2));

console.log(obj.test.length+" éléments" )

